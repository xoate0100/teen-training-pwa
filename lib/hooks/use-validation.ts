'use client';

import { useState, useCallback } from 'react';
import {
  validateSession,
  validateCheckIn,
  validateProgressMetrics,
  validateAchievement,
  validateNotification,
  formatValidationError,
} from '@/lib/validation/schemas';
import { DataIntegrityChecker } from '@/lib/validation/data-integrity';
import { OfflineHandler } from '@/lib/offline/offline-handler';
import { toast } from 'sonner';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function useValidation() {
  const [isValidating, setIsValidating] = useState(false);

  // Validate session data
  const validateSessionData = useCallback(
    async (sessionData: any): Promise<ValidationResult> => {
      setIsValidating(true);
      try {
        // Schema validation
        const schemaResult = validateSession(sessionData);
        if (!schemaResult.success) {
          return {
            isValid: false,
            errors: [formatValidationError(schemaResult.error)],
            warnings: [],
          };
        }

        // Data integrity check
        const integrityResult = DataIntegrityChecker.checkSession(
          schemaResult.data
        );

        return {
          isValid: integrityResult.isValid,
          errors: integrityResult.errors,
          warnings: integrityResult.warnings,
        };
      } catch (error) {
        console.error('Session validation error:', error);
        return {
          isValid: false,
          errors: [
            'Validation failed: ' +
              (error instanceof Error ? error.message : 'Unknown error'),
          ],
          warnings: [],
        };
      } finally {
        setIsValidating(false);
      }
    },
    []
  );

  // Validate check-in data
  const validateCheckInData = useCallback(
    async (checkInData: any): Promise<ValidationResult> => {
      setIsValidating(true);
      try {
        // Schema validation
        const schemaResult = validateCheckIn(checkInData);
        if (!schemaResult.success) {
          return {
            isValid: false,
            errors: [formatValidationError(schemaResult.error)],
            warnings: [],
          };
        }

        // Data integrity check
        const integrityResult = DataIntegrityChecker.checkCheckIn(
          schemaResult.data
        );

        return {
          isValid: integrityResult.isValid,
          errors: integrityResult.errors,
          warnings: integrityResult.warnings,
        };
      } catch (error) {
        console.error('Check-in validation error:', error);
        return {
          isValid: false,
          errors: [
            'Validation failed: ' +
              (error instanceof Error ? error.message : 'Unknown error'),
          ],
          warnings: [],
        };
      } finally {
        setIsValidating(false);
      }
    },
    []
  );

  // Validate progress metrics data
  const validateProgressMetricsData = useCallback(
    async (metricsData: any): Promise<ValidationResult> => {
      setIsValidating(true);
      try {
        // Schema validation
        const schemaResult = validateProgressMetrics(metricsData);
        if (!schemaResult.success) {
          return {
            isValid: false,
            errors: [formatValidationError(schemaResult.error)],
            warnings: [],
          };
        }

        // Data integrity check
        const integrityResult = DataIntegrityChecker.checkProgressMetrics(
          schemaResult.data
        );

        return {
          isValid: integrityResult.isValid,
          errors: integrityResult.errors,
          warnings: integrityResult.warnings,
        };
      } catch (error) {
        console.error('Progress metrics validation error:', error);
        return {
          isValid: false,
          errors: [
            'Validation failed: ' +
              (error instanceof Error ? error.message : 'Unknown error'),
          ],
          warnings: [],
        };
      } finally {
        setIsValidating(false);
      }
    },
    []
  );

  // Validate achievement data
  const validateAchievementData = useCallback(
    async (achievementData: any): Promise<ValidationResult> => {
      setIsValidating(true);
      try {
        // Schema validation
        const schemaResult = validateAchievement(achievementData);
        if (!schemaResult.success) {
          return {
            isValid: false,
            errors: [formatValidationError(schemaResult.error)],
            warnings: [],
          };
        }

        // Data integrity check
        const integrityResult = DataIntegrityChecker.checkAchievement(
          schemaResult.data
        );

        return {
          isValid: integrityResult.isValid,
          errors: integrityResult.errors,
          warnings: integrityResult.warnings,
        };
      } catch (error) {
        console.error('Achievement validation error:', error);
        return {
          isValid: false,
          errors: [
            'Validation failed: ' +
              (error instanceof Error ? error.message : 'Unknown error'),
          ],
          warnings: [],
        };
      } finally {
        setIsValidating(false);
      }
    },
    []
  );

  // Validate notification data
  const validateNotificationData = useCallback(
    async (notificationData: any): Promise<ValidationResult> => {
      setIsValidating(true);
      try {
        // Schema validation
        const schemaResult = validateNotification(notificationData);
        if (!schemaResult.success) {
          return {
            isValid: false,
            errors: [formatValidationError(schemaResult.error)],
            warnings: [],
          };
        }

        // Data integrity check
        const integrityResult = DataIntegrityChecker.checkNotification(
          schemaResult.data
        );

        return {
          isValid: integrityResult.isValid,
          errors: integrityResult.errors,
          warnings: integrityResult.warnings,
        };
      } catch (error) {
        console.error('Notification validation error:', error);
        return {
          isValid: false,
          errors: [
            'Validation failed: ' +
              (error instanceof Error ? error.message : 'Unknown error'),
          ],
          warnings: [],
        };
      } finally {
        setIsValidating(false);
      }
    },
    []
  );

  // Validate with offline handling
  const validateWithOfflineHandling = useCallback(
    async (
      type:
        | 'session'
        | 'checkIn'
        | 'progressMetric'
        | 'achievement'
        | 'notification',
      data: any
    ): Promise<{
      isValid: boolean;
      shouldQueue: boolean;
      result: ValidationResult;
    }> => {
      const isOnline = OfflineHandler.isOnline();
      let validationResult: ValidationResult;

      switch (type) {
        case 'session':
          validationResult = await validateSessionData(data);
          break;
        case 'checkIn':
          validationResult = await validateCheckInData(data);
          break;
        case 'progressMetric':
          validationResult = await validateProgressMetricsData(data);
          break;
        case 'achievement':
          validationResult = await validateAchievementData(data);
          break;
        case 'notification':
          validationResult = await validateNotificationData(data);
          break;
        default:
          validationResult = {
            isValid: false,
            errors: ['Unknown validation type'],
            warnings: [],
          };
      }

      // If offline and validation passed, queue for sync
      const shouldQueue = !isOnline && validationResult.isValid;

      if (shouldQueue) {
        OfflineHandler.queueForSync(type, data);
        toast.info(
          'Data saved offline and will sync when connection is restored'
        );
      }

      return {
        isValid: validationResult.isValid,
        shouldQueue,
        result: validationResult,
      };
    },
    [
      validateSessionData,
      validateCheckInData,
      validateProgressMetricsData,
      validateAchievementData,
      validateNotificationData,
    ]
  );

  // Get offline status
  const getOfflineStatus = useCallback(() => {
    return OfflineHandler.getOfflineStatus();
  }, []);

  // Check if sync is needed
  const needsSync = useCallback(() => {
    return OfflineHandler.needsSync();
  }, []);

  // Get storage info
  const getStorageInfo = useCallback(() => {
    return OfflineHandler.getStorageInfo();
  }, []);

  return {
    isValidating,
    validateSessionData,
    validateCheckInData,
    validateProgressMetricsData,
    validateAchievementData,
    validateNotificationData,
    validateWithOfflineHandling,
    getOfflineStatus,
    needsSync,
    getStorageInfo,
  };
}

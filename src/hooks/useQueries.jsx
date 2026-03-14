import { useQuery } from '@tanstack/react-query';
import * as api from '../api';

/**
 * Fetch a single patient by ID and their related resources
 */
export function usePatientDetails(patientId) {
  return useQuery({
    queryKey: ['patient', 'details', patientId],
    queryFn: () => api.loadPatientDetailed(patientId),
    enabled: !!patientId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch patient resources explicitly
 */
export function usePatientResources(patientId, resourceType, count = 50, page = 1) {
  return useQuery({
    queryKey: ['patient', patientId, 'resources', resourceType, { page, count }],
    queryFn: () => api.getPatientResources(patientId, resourceType, count, page),
    enabled: !!patientId && !!resourceType,
  });
}

/**
 * Fetch list of ALL patients with filters and pagination
 */
export function usePatients(params, activeFilters = {}) {
  return useQuery({
    queryKey: ['patients', params, activeFilters],
    queryFn: () => {
      const hasFilters = Object.keys(activeFilters).length > 0 || (activeFilters.filters && Object.keys(activeFilters.filters).length > 0) || (activeFilters.general_filters && Object.keys(activeFilters.general_filters).length > 0);
      return hasFilters ? api.loadPatientsWithFilters(params, activeFilters) : api.loadPatients(params);
    },
    staleTime: 30 * 1000, 
    keepPreviousData: true,
  });
}

export function usePatientFacets(params) {
  return useQuery({
    queryKey: ['patient', 'facets', params],
    queryFn: () => api.fetchPatientFacets(params),
    staleTime: 5 * 60 * 1000,
  });
}

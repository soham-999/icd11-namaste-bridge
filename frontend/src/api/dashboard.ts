// src/api/dashboard.ts
import { backendApi, USE_SAMPLE_DATA } from './client';
import { sampleDashboardStats, sampleAppointmentTrend, sampleActivity } from './sampleData';
import type { DashboardStats, AppointmentTrendPoint, ActivityItem } from './types';

export async function getDashboardStats(): Promise<DashboardStats> {
  if (USE_SAMPLE_DATA) return sampleDashboardStats;
  try {
    const { data } = await backendApi.get<DashboardStats>('/dashboard/stats');
    return data;
  } catch { return sampleDashboardStats; }
}

export async function getAppointmentTrend(): Promise<AppointmentTrendPoint[]> {
  if (USE_SAMPLE_DATA) return sampleAppointmentTrend;
  try {
    const { data } = await backendApi.get<AppointmentTrendPoint[]>('/dashboard/appointment-trend');
    return data;
  } catch { return sampleAppointmentTrend; }
}

export async function getRecentActivity(): Promise<ActivityItem[]> {
  if (USE_SAMPLE_DATA) return sampleActivity;
  try {
    const { data } = await backendApi.get<ActivityItem[]>('/dashboard/activity');
    return data;
  } catch { return sampleActivity; }
}
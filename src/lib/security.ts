export type UserRole =
  | 'patient' | 'doctor' | 'nurse' | 'pharmacist' | 'pharmacy'
  | 'clinic' | 'hospital' | 'laboratory' | 'admin';

export const rolePermissions: Record<UserRole, string[]> = {
  patient: ['profile.read','appointments.create','records.read.own','payments.create'],
  doctor: ['patients.read.assigned','encounters.create','prescriptions.create','appointments.manage'],
  nurse: ['patients.read.assigned','care.create','appointments.manage'],
  pharmacist: ['prescriptions.read','orders.manage','inventory.manage'],
  pharmacy: ['patients.read.minimal','prescriptions.read','orders.manage','inventory.manage','payments.manage'],
  clinic: ['patients.create','encounters.manage','billing.manage','staff.manage'],
  hospital: ['patients.create','encounters.manage','departments.manage','billing.manage'],
  laboratory: ['lab.orders.read','lab.results.create','billing.manage'],
  admin: ['organizations.verify','users.manage','audit.read','system.manage'],
};

export function can(role: UserRole, permission: string) {
  return rolePermissions[role]?.includes(permission) ?? false;
}

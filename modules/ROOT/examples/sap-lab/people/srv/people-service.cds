using { sap.guide.people as db } from '../db/schema';
service PeopleService {
  entity Employees                  as projection on db.Employees;
  entity OrganizationalAssignments  as projection on db.OrganizationalAssignments;
  entity BasicPayRecords            as projection on db.BasicPayRecords;
  entity ParkingPermits             as projection on db.ParkingPermits;
}

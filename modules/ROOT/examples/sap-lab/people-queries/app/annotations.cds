using PeopleService as service from '../srv/people-service';

annotate service.Employees with {
  PersonnelNumber @title : 'Personnel Number';
  Name            @title : 'Name';
  EntryDate       @title : 'Entry Date';
};
annotate service.OrganizationalAssignments with {
  BeginDate        @title : 'Valid From';
  EndDate          @title : 'Valid To';
  PersonnelArea    @title : 'Personnel Area';
  PersonnelSubarea @title : 'Personnel Subarea';
  EmployeeSubgroup @title : 'Employee Subgroup';
  Position         @title : 'Position';
};
annotate service.BasicPayRecords with {
  BeginDate @title : 'Valid From';
  EndDate   @title : 'Valid To';
  PayBasis  @title : 'Pay Basis';
  Amount    @title : 'Amount';
  Currency  @title : 'Currency';
};
annotate service.ParkingPermits with {
  BeginDate @title : 'Valid From';
  EndDate   @title : 'Valid To';
  Permit    @title : 'Permit';
};

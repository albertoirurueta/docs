using { ClaimsService } from './claims-service';

annotate ClaimsService with @(requires: 'authenticated-user');

annotate ClaimsService.Claims with @(restrict: [
  { grant: 'READ', to: 'authenticated-user' },
  { grant: ['CREATE', 'UPDATE', 'DELETE', 'approve'], to: 'admin' }
]);

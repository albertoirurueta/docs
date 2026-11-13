using AllocationService as service from '../srv/allocation-service';

// Fiori elements list report of the cost center balances.
annotate service.CostCenterBalances with {
  CostCenter @title : 'Cost Center';
  GLAccount  @title : 'G/L Account';
  Balance    @title : 'Balance in Company Code Currency';
};
annotate service.CostCenterBalances with @(
  UI.HeaderInfo : {
    TypeName : 'Cost Center Balance', TypeNamePlural : 'Cost Center Balances'
  },
  UI.LineItem : [
    { Value : CostCenter }, { Value : GLAccount }, { Value : Balance }
  ]
);

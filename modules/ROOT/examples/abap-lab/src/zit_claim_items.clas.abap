CLASS zit_claim_items DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    " tag::types[]
    TYPES: BEGIN OF ty_item,
             category TYPE string,
             item_no  TYPE i,
             amount   TYPE i,
           END OF ty_item.
    TYPES ty_items TYPE STANDARD TABLE OF ty_item WITH EMPTY KEY.
    " end::types[]
    " tag::def-build[]
    METHODS build RETURNING VALUE(items) TYPE ty_items.
    " end::def-build[]
    " tag::def-read[]
    METHODS read_rows IMPORTING items TYPE ty_items.
    " end::def-read[]
    " tag::def-group[]
    METHODS list_by_category IMPORTING items TYPE ty_items.
    " end::def-group[]
    " tag::def-total[]
    METHODS total_and_filter IMPORTING items TYPE ty_items.
    " end::def-total[]
ENDCLASS.

CLASS zit_claim_items IMPLEMENTATION.
  " tag::build[]
  METHOD build.
    items = VALUE #( ( category = `TRAVEL` item_no = 1 amount = 45 )
                     ( category = `MEALS`  item_no = 2 amount = 18 )
                     ( category = `TRAVEL` item_no = 3 amount = 32 )
                     ( category = `HOTEL`  item_no = 4 amount = 120 )
                     ( category = `MEALS`  item_no = 5 amount = 22 )
                     ( category = `TRAVEL` item_no = 6 amount = 12 ) ).
  ENDMETHOD.
  " end::build[]
  " tag::read[]

  METHOD read_rows.
    DATA(third) = items[ item_no = 3 ].
    WRITE / |Item 3: { third-category }, { third-amount } EUR|.

    IF line_exists( items[ item_no = 9 ] ).
      WRITE / `Item 9 exists`.
    ELSE.
      WRITE / `Item 9 does not exist`.
    ENDIF.

    READ TABLE items INTO DATA(found) WITH KEY category = `HOTEL`.
    WRITE / |READ TABLE: sy-subrc { sy-subrc }, item { found-item_no }|.

    READ TABLE items INTO found WITH KEY category = `FLIGHT`.
    WRITE / |READ TABLE: sy-subrc { sy-subrc }|.
  ENDMETHOD.
  " end::read[]
  " tag::group[]

  METHOD list_by_category.
    DATA(sorted) = items.
    SORT sorted BY category item_no.

    LOOP AT sorted INTO DATA(item).
      AT NEW category.
        WRITE / |{ item-category }:|.
      ENDAT.
      WRITE / |  item { item-item_no }, { item-amount } EUR|.
    ENDLOOP.
  ENDMETHOD.
  " end::group[]
  " tag::total[]

  METHOD total_and_filter.
    DATA(total) = REDUCE i( INIT sum = 0
                            FOR item IN items
                            NEXT sum = sum + item-amount ).
    WRITE / |Total: { total } EUR|.

    DATA by_category TYPE SORTED TABLE OF ty_item WITH NON-UNIQUE KEY category.
    by_category = items.
    DATA(travel) = FILTER #( by_category WHERE category = `TRAVEL` ).
    WRITE / |Travel items: { lines( travel ) }|.

    DATA(travel_total) = REDUCE i( INIT sum = 0
                                   FOR item IN travel
                                   NEXT sum = sum + item-amount ).
    WRITE / |Travel total: { travel_total } EUR|.
  ENDMETHOD.
  " end::total[]
ENDCLASS.

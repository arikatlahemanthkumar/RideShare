1. User-model:
    ->name
    ->email
    ->password
    ->role - ['admin', 'owner', 'traveller']

2. carDetails
    carModel
    carNumber
    seatingCapacity
    photos
    insurance
    ->drivingLicence
    -> ownerId 
    -> isApproved

3. traveller-model:
    ->name
    ->aadharcard
    -> userId
    -> isApproved

4. Trip-model:
    
     ->carOwnerId
     ->carId 
     ->journeyDateTime
     ->seats- [{ s1 }, { s2}, { s3 }]
     ->source
     ->destination
     ->status
     ->amount


5. BookingModel
    -> travallerId
    -> tripId
    -> seatIds 
    -> totalAmount
    -> isApproved

6. payment-model:
    ->bookingID
    ->travellerId
    ->amountPaid
    ->paymentDate
    ->receipt

7. carTacking - model:
    ->carOwnerId
    ->currentLocation 
        > latitude
        > longitude
    ->route
    ->lastUpdated

8. review-model
    carOwner Id
    ratings
    comments
9. notification - model 
   user Id
   message
   type
   isRead
   createdAt


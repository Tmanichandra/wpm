// ==================================================
// for this application, you can find your own personal lat/long with:
// https://whatsmylatlng.com/
// RVA:
// (37.6192, -77.4960) lat/long, so flip to long/lat:
// -77.4960, 37.6192
// ==================================================

// LOCAL RVA LOCATIONS DATA

// ==================================================
// Proper Pie - 2505 E Broad St #100, Richmond VA 23223
// Sun : 10:00am - 6:00pm
// Mon, Tue : Closed
// Wed, Thu, Fri, Sat : 10:00am - 7:00pm
// New Zealand Pies, Pastries, Wifi
// Longitude: -77.418548, Latitude: 37.531502
// -77.418548, 37.531502
// ==================================================

// ==================================================
// Bottoms Up Pizza - 1700 Dock St, Richmond, VA 23223
// Sun, Thu : 11:00am - 11:00pm
// Mon, Tue, Wed : 11:00am - 10:00pm
// Fri, Sat : 11:00am - 12:00am
// Amazeballs Pizza, Beer, Wifi
// Longitude: -77.42954, Latitude: 37.532191
// -77.42954, 37.532191
// ==================================================

// ==================================================
// Pizza & Beer of Richmond - 2553 W Cary St, Richmond, VA 23220
// Mon, Tue, Wed : 11:00am - 11:00pm
// Thu, Fri, Sat : 11:00am - 12:00am
// Gourmet Pizza, PBR, Wifi
// Longitude: -77.473308, Latitude: 37.550535
// -77.473308, 37.550535
// ==================================================

/* seed document

db.locations.save({
  name: 'Proper Pie',
  address: '2505 E Broad St #100, Richmond VA 23223',
  rating: 5,
  facilities: ['New Zealand Pies', 'Pastries', 'Wifi'],
  coords: [-77.418548, 37.531502],
  openingTimes: [{
    days: 'Sun',
    opening: '10:00am',
    closing: '6:00pm',
    closed: false
  },{
    days: 'Mon, Tue',
    closed: true
  },{
    days: 'Wed, Thu, Fri, Sat',
    opening: '10:00am',
    closing: '7:00pm',
    closed: false
  }]
})

*/

// ==================================================
// ==================================================

// SEED DATA FROM "Getting MEAN" BOOK (locations in Reading, UK)

/* book example seed document

db.locations.save({
  name: 'Starcups',
  address: '125 High Street, Reading, RG6 1PS',
  rating: 3,
  facilities: ['Hot drinks', 'Food', 'Premium wifi'],
  coords: [-0.9690884, 51.455041],
  openingTimes: [{
    days: 'Monday - Friday',
    opening: '7:00am',
    closing: '7:00pm',
    closed: false
  }, {
    days: 'Saturday',
    opening: '8:00am',
    closing: '5:00pm',
    closed: false
  }, {
    days: 'Sunday',
    closed: true
  }]
})

*/

/* 

add more paths data to the {name: 'Starcups'} document
note: manually adds an _id: ObjectId() to the reviews: object added
since an object is being pushed into the new reviews:, reviews: type becomes Array
createdOn: new Date(..) creates an ISODate(..) data entry out of passed date

db.locations.update({
  name: 'Starcups'
}, {
  $push: {
    reviews: {
      author: 'Simon Holmes',
      _id: ObjectId(),
      rating: 5,
      createdOn: new Date("Mar 12, 2017"),
      reviewText: "What a great place."
    }
  }
})

*/

// ==================================================
// ==================================================

/* sample location 2

db.locations.save({
  name: 'Cafe Hero',
  address: '150 High Street, Reading, RG6 1PS',
  rating: 4,
  facilities: ['Hot drinks', 'Premium wifi'],
  coords: [-0.9690621, 51.455982],
  openingTimes: [{
    days: 'Monday',
    opening: '7:00am',
    closing: '7:00pm',
    closed: false
  }, {
    days: 'Tuesday - Saturday',
    opening: '11:00am',
    closing: '2:00pm',
    closed: false
  }, {
    days: 'Sunday',
    closed: true
  }]
})

*/

/* add data for sample location 2

db.locations.update({
  name: 'Cafe Hero'
}, {
  $push: {
    reviews: {
      author: 'Ace of Base',
      _id: ObjectId(),
      rating: 4,
      createdOn: new Date("July 1, 1991"),
      reviewText: "Horsti vorkken dorki nork nork."
    }
  }
})

*/

// ==================================================
// ==================================================

/* sample location 3

db.locations.save({
  name: 'Burger Queen',
  address: '175 High Street, Reading, RG6 1PS',
  rating: 2,
  facilities: ['Food', 'Premium wifi'],
  coords: [-0.9690001, 51.455333],
  openingTimes: [{
    days: 'Monday',
    closed: true
  }, {
    days: 'Tuesday - Friday',
    opening: '8:00am',
    closing: '5:00pm',
    closed: false
  }, {
    days: 'Saturday',
    opening: '1:00am',
    closing: '2:00pm',
    closed: false
  },{
    days: 'Sunday',
    opening: '7:00am',
    closing: '7:00pm',
    closed: false
  }]
})

*/

/* add data for sample location 3

db.locations.update({
  name: 'Burger Queen'
}, {
  $push: {
    reviews: {
      author: 'Harvey the Rabbit',
      _id: ObjectId(),
      rating: 3,
      createdOn: new Date("Jan 1, 1970"),
      reviewText: "Hippity hop hop, hippity hop hop."
    }
  }
})

*/

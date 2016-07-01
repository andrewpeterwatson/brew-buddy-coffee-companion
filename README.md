# brew-buddy-coffee-companion
Companion app for tracking daily brewing and logging data


## Routes
All routes are found at the `/api/` endpoint.

### Origin
A coffee origin includes where the coffee comes from, and the recommended brew method. All routes require an authorized user.

* `POST -- /origin` - Creates a new origin.
* `PUT -- /origin/:id` - Update an origin.
* `GET -- /origin/all` - Returns an array of all origins
* `GET -- /origin/:id` - Returns a single origin
* `GET -- /origin/:id/method` - Returns the origin's recommended brew method. [NOT YET IMPLEMENTED]
* `GET -- /api/origin/:id/entries` - Returns all entires containing the specified origin. [NOT YET IMPLEMENTED]
* `DELETE -- /origin/:id` - Deletes an origin id

### Method
A brew method contains information and instructions about brewing coffee with that method. Information includes how long the coffee should be brewed, instructions for brewing and the ratio between coffee and water.

* `POST -- /method` - Creates a new method.
* `PUT -- /method/:id` - Update an method.
* `GET -- /method/all` - Returns an array of all methods
* `GET -- /method/:id` - Returns a single method
* `GET -- /method/:id/origins` - Returns all of the origins with the specified method. [NOT YET IMPLEMENTED]
* `GET -- /method/:id/entries` - Returns the method's entires. [NOT YET IMPLEMENTED]
* `DELETE -- /method/:id` - Deletes an method id

### Flavor
Every cup of coffee can be described using a range of predefined flavors.

* `POST -- /flavor` - Creates a new flavor.
* `PUT -- /flavor/:id` - Update an flavor.
* `GET -- /flavor/all` - Returns an array of all flavors
* `GET -- /flavor/:id` - Returns a single flavor
* `GET -- /flavor/:id/origins` - Returns all of the origins with the specified flavor. [NOT YET IMPLEMENTED]
* `GET -- /flavor/:id/entries` - Returns the flavor's entires. [NOT YET IMPLEMENTED]
* `DELETE -- /flavor/:id` - Deletes an flavor id

### Entry
An entry represents a single cup of coffee. The entry records the origin, method and particular characteristics of that cup.
* `POST -- /entry` - Creates a new entry.
* `PUT -- /entry/:id` - Update an entry.
* `GET -- /entry/all` - Returns an array of all entries
* `GET -- /entry/:id` - Returns a single entry
* `GET -- /api/entries/search?prop=searchfield`
* `DELETE -- /entry/:id` - Deletes an entry id

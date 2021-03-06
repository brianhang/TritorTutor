"use strict"

/**
 * This file containes the TutorModel which is responsible for access to 
 * tutors on the database.
 */

var db = require('./database.js');

var TutorModel = {};

/**
 * Creates a tutor listing by inserting it into the database.
 *
 * @param course The course this listing is for.
 * @param userID The user that is tutoring for this listing.
 * @param desc A description of the service the user offers.
 * @param price The price asked for the service.
 * @param nego Willingness to change price.
 * @return A promise that contains nothing. 
 */
TutorModel.create = function(course, userID, desc, price, nego) {
    console.log(231)
	// Create new listing by inserting to the table in the database.
	return db.insert('tritor_tutorlist', {
		classID: course,
		tutorID: userID,
		description: desc,
        // avgRating nullable in the database
		price: price,
		negotiable:	nego,
	});
}

/**
 * Deletes a tutor listing by deleting it from the database.
 *
 * @param course The course this listing is for.
 * @param userID The user that is tutoring for this listing.
 * @return A promise containing nothing.
 */
TutorModel.delete = function(course, userID) {
	return db.query('DELETE FROM tritor_tutorlist WHERE classID = ? AND tutorID = ? LIMIT 1', [course, userID]);
}

/**
 * Get all listings for a certain course.
 *
 * @param course The course you want all listings for.
 * @return A promise containing all listings for the specified course.
 *         Listings will be objects containing tutorID, description, avgRating, 
 *         price, and negotiable. 
 */
TutorModel.get = function(course) {
	// Return tutor listing attributes
	var columns = ['tutorID', 'description', 'price', 'negotiable'];
	
	// Only find matching listings
	var conditions = 'classID=' + db.escape(course);

	return db.select('tritor_tutorlist', columns, conditions);
}

/**
 * Returns tutoring information for a specific user for a given course.
 *
 * @param userID The ID of the desired user.
 * @param courseID The ID of the desired course.
 * @return A promise that contains an object with tutoring information. If the
 *         user is not a tutor for the given course, then this is null.
 */
TutorModel.getByUser = function(userID, courseID) {
    const values = ['description', 'price', 'negotiable'];
    const conditions = 'tutorID=' + db.escape(userID) +
                       ' AND classID=' + db.escape(courseID);

    return db.select('tritor_tutorlist', values, conditions, 1).then((results) => {
        if (results && results.length > 0) {
            return results[0];
        }

        return null;
    });
}

/**
 * Retrieves all of the courses a user tutors for.
 *
 * @param userID The ID of the desired user.
 * @return A promise containing a list of the courses for the tutor.
 */
TutorModel.getAllByUser = function(userID) {
    const values = ['price', 'negotiable', 'classID'];
    const conditions = 'tutorID=' + db.escape(userID);

    return db.select('tritor_tutorlist', values, conditions, null, 'classID');
}

/**
 * Retrieves the top 10 tutors for Tritor. This is done by getting the top 10
 * rating users. Since ratings are only given to tutors, we can assume anyone
 * who has a rating has tutored. Hence, we do not need to check for the user
 * actually tutoring for someone.
 *
 * @return A promise containing a list of the top 10 tutors.
 */
TutorModel.getPopular = function() {
    return db.select('tritor_users', ['userID', 'username'], null, 10,
                     'avgRating DESC').then((results) => {
        return results.map((result) => {
            return {
                userID: result.userID,
                username: result.username
            };
        });
    })
}

/**
 * Update a certain listing.
 *
 * @param course The course this listing is for.
 * @param userID The user that is tutoring for this listing.
 * @param data Object containing data in the tutor listings that needs to be
 *        updated. Possible data - avgRating, description, price, negotiable.
 * @return A promise that contains nothing.
 */
TutorModel.update = function(course, userID, data) {
	var conditions = 'classID=' + db.escape(course) + ' AND tutorID=' + userID;

	return db.update('tritor_tutorlist', data, conditions, 1);
}

module.exports = TutorModel;

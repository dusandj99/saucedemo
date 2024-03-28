import { test, expect, type Page, request } from '@playwright/test';
import Ajv from "ajv";
const schemas = JSON.parse(JSON.stringify(require('../utils/schemas.json')));
const payloads = JSON.parse(JSON.stringify(require('../utils/payloads.json')));
const createBookingDD = JSON.parse(JSON.stringify(require('../utils/createBooking.json')));

const baseUrl = 'https://restful-booker.herokuapp.com';
const ajv = new Ajv();
let validate;

test('Restful Booker API flow', async() => {

    const apiContext = await request.newContext();

    //------ healthCheck

    const healthCheckResponse =  await apiContext.get(`${baseUrl}/ping`);

    expect(healthCheckResponse.status()).toEqual(201); //status
    expect((await healthCheckResponse.body()).toString()).toEqual('Created'); // message 

    //----- login

    const loginResponse = await apiContext.post(`${baseUrl}/auth`, {data: payloads.loginPayload});
    const loginResponseJson = await loginResponse.json();
    const token = loginResponseJson.token; //token for next requests (put,patch)

    validate = ajv.compile(schemas.loginSchema);
    expect(validate(loginResponseJson)).toBeTruthy(); // schema validation
    expect(loginResponse.status()).toEqual(200); // status

    //------- createBooking

    const createBookingResponse =  await apiContext.post(`${baseUrl}/booking`, {data: payloads.createBookingPayload});
    const createBookingResponseJson = await createBookingResponse.json();
    
    validate = ajv.compile(schemas.createBookingSchema);
    const bookingId:number = createBookingResponseJson.bookingid; //bookingid for search

    expect(validate(createBookingResponseJson)).toBeTruthy(); // schema validation
    expect(createBookingResponse.status()).toEqual(200); // status 
    expect(createBookingResponseJson.booking).toEqual(payloads.createBookingPayload); //data validation

    //------- getAllBookings -find createdBooking

    const getBookingsResponse =  await apiContext.get(`${baseUrl}/booking`);
    const getBookingsResponseJson = await getBookingsResponse.json();

    validate = ajv.compile(schemas.getBookingsSchema);

    function findBooking(id:Number):Boolean {
        for(let booking of getBookingsResponseJson){
            if(booking.bookingid === bookingId){
                return true;
            }
        }
        return false;
    }

    expect(validate(getBookingsResponseJson)).toBeTruthy(); // schema validation
    expect(getBookingsResponse.status()).toEqual(200); // status 
    expect(findBooking(bookingId)).toBeTruthy(); //contains created booking

    //------- getBookingWithId (created booking)
    
    let getBookingResponse =  await apiContext.get(`${baseUrl}/booking/${bookingId}`);
    let getBookingResponseJson = await getBookingResponse.json();

    validate = ajv.compile(schemas.getBookingSchema);

    expect(validate(getBookingResponseJson)).toBeTruthy(); //schema validation
    expect(getBookingsResponse.status()).toEqual(200); //status 
    expect(getBookingResponseJson).toEqual(payloads.createBookingPayload); //data validation

    //------- updateBooking

    const updateBookingResponse =  await apiContext.put(`${baseUrl}/booking/${bookingId}`,
        {
            data: payloads.updateBookingPayload,
            headers: {
                'Cookie' : `token=${token}`
            }
        });

    const updateBookingResponseJson = await updateBookingResponse.json();

    validate = ajv.compile(schemas.getBookingSchema);

    expect(validate(updateBookingResponseJson)).toBeTruthy(); //schema validation
    expect(updateBookingResponse.status()).toEqual(200); //status 
    expect(updateBookingResponseJson).toEqual(payloads.updateBookingPayload); //data validation

    //------ partialUpdateBooking

    const partialUpdateBookingResponse =  await apiContext.patch(`${baseUrl}/booking/${bookingId}`,
        {
            data: payloads.partialUpdatePayload,
            headers: {
                'Cookie' : `token=${token}`
            }
        });

    const partialUpdateBookingResponseJson = await partialUpdateBookingResponse.json();

    validate = ajv.compile(schemas.getBookingSchema);

    expect(validate(updateBookingResponseJson)).toBeTruthy(); //schema validation
    expect(updateBookingResponse.status()).toEqual(200); //status 
    expect(partialUpdateBookingResponseJson.firstname).toEqual(payloads.partialUpdatePayload.firstname); //data validation
    expect(partialUpdateBookingResponseJson.lastname).toEqual(payloads.partialUpdatePayload.lastname); //data validation
    expect(partialUpdateBookingResponseJson.totalprice).toEqual(payloads.partialUpdatePayload.totalprice); //data validation
    
    //------ getBoookingWithId + validate data with partialUpdateResponse data

    getBookingResponse =  await apiContext.get(`${baseUrl}/booking/${bookingId}`);
    getBookingResponseJson = await getBookingResponse.json();
    
    validate = ajv.compile(schemas.getBookingSchema);
    
    expect(validate(getBookingResponseJson)).toBeTruthy(); //schema validation
    expect(getBookingsResponse.status()).toEqual(200); //status 
    expect(getBookingResponseJson).toEqual(partialUpdateBookingResponseJson); //data validation

    //------- delete booking with id
    
    const deleteBookingResponse =  await apiContext.delete(`${baseUrl}/booking/${bookingId}`,
        {
            headers: {
                'Cookie' : `token=${token}`
            }
        });

    expect(deleteBookingResponse.status()).toEqual(201); //status 
    expect((await deleteBookingResponse.body()).toString()).toEqual('Created'); // message 
    
    //------- try to get booking after delete

    getBookingResponse =  await apiContext.get(`${baseUrl}/booking/${bookingId}`);
    
    expect(getBookingResponse.status()).toEqual(404); //status not found
    expect((await getBookingResponse.body()).toString()).toEqual('Not Found'); // message 

})

for(const testCasePayload of createBookingDD){
    test(`Create booking endpoint:${testCasePayload.testName}`, async () => {

        let payload = {
            firstname : testCasePayload.firstname,
            lastname : testCasePayload.lastname,
            totalprice : testCasePayload.totalprice,
            depositpaid : testCasePayload.depositpaid,
            bookingdates : {
                checkin : testCasePayload.bookingdates.checkin,
                checkout : testCasePayload.bookingdates.checkout
            },
            additionalneeds : testCasePayload.additionalneeds
        }
        //------- createBooking
        const apiContext = await request.newContext();

        let createBookingResponse =  await apiContext.post(`${baseUrl}/booking`, {data: payload}); //dd
        let createBookingResponseJson;
        let bookingId:number;
        if(!testCasePayload.negativeTest){
            createBookingResponseJson = await createBookingResponse.json();
            bookingId = createBookingResponseJson.bookingid; //bookingid for search
            
            let getBookingResponse =  await apiContext.get(`${baseUrl}/booking/${bookingId}`); // find created booking
            let getBookingResponseJson = await getBookingResponse.json();

            validate = ajv.compile(schemas.getBookingSchema);

            expect(validate(getBookingResponseJson)).toBeTruthy(); //schema validation
            expect(getBookingResponse.status()).toEqual(200); //status 
            expect(getBookingResponseJson).toEqual(payload); //data validation from create req body
        }
        
        validate = ajv.compile(schemas.createBookingSchema);

        if(!testCasePayload.negativeTest){
            expect(validate(createBookingResponseJson)).toBeTruthy(); // schema validation
            expect(createBookingResponse.status()).toEqual(200); // status 
            expect(createBookingResponseJson.booking).toEqual(payload); //data validation
        } else {
            expect(createBookingResponse.status()).toEqual(500); // status 
            expect((await createBookingResponse.body()).toString()).toEqual('Internal Server Error'); // message 
        }
    })
}
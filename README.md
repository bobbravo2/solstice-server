# Energy Management Dashboard - Server

## Usage
See the package.json for scripts:
* `yarn watch` - runs the server with Nodemon (needs to be installed globally)
* `yarn start` - runs the server on port 3001
* `yarn test` - runs unit tests

## Updating records

the `data/csv-source/` directory is used to build the `JSON` objects inside of the `/data/records/` folder. 

The CSV files **MUST** maintain the following headers:

| year | month | kwh | solar-kwh | utility-kwh | bill | savings | zip-code |  
| --- | --- | --- | --- | --- | --- | --- | --- |  


Once a new CSV file has been generated, run `./update-records-from-csv.sh` and new records will be generated. Note that the user_id **MUST** match the file name from the root json object. (IE `data/1158.json.user.id === data/records/1158.json`) - think of this as a foreign key constraint in an RDBMS.

## Future Features
- [ ] Add NREL model for solar generation based on ZIP code and SAM model [solar data](https://developer.nrel.gov/docs/solar/solar-resource-v1/)
```
GET https://developer.nrel.gov/api/solar/solar_resource/v1.json?api_key=&address=02129
```
## Known Bugs

- [ ] Hardcoded Validation Logic

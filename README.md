# Energy Management Dashboard - Server

## Updating records

the `data/csv-source/` directory is used to build the `JSON` objects inside of the `/data/records/` folder. 

The CSV files **MUST** maintain the following headers:

| year | month | kwh | solar-kwh | utility-kwh | bill | savings | zip-code |  
| --- | --- | --- | --- | --- | --- | --- | --- |  


Once a new CSV file has been generated, run `./update-records-from-csv.sh` and new records will be generated. Note that the user_id **MUST** match the file name from the root json object. (IE `data/1158.json.user.id === data/records/1158.json`) - think of this as a foreign key constraint in an RDBMS.
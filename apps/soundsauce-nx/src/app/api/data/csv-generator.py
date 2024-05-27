import argparse
import csv
import random
import uuid
# Create the parser
parser = argparse.ArgumentParser(
    description='Generate a CSV file with random data.')

# Add the arguments
parser.add_argument('num_records', type=int,
                    help='The number of records to generate.')
parser.add_argument('filename', type=str,
                    help='The name of the CSV file to save to.')

# Parse the arguments
args = parser.parse_args()

# Define the number of records to generate
num_records = args.num_records
filename = args.filename

# Open the CSV file for writing
with open(f"{filename}.csv", 'w', newline='') as csvfile:
    # Create a CSV writer object
    writer = csv.writer(csvfile, quotechar='"', quoting=csv.QUOTE_NONNUMERIC)

    # Write the header row
    writer.writerow(["ID", "RESULTID", "BATTERYLOW", "DURATIONSEC", "ENDDATETIME", "NOTES", "OVERLOAD", "PAUSEDURATIONSEC", "RESPONSE", "RUNNO", "STARTDATETIME", "OCTAVECOUNT", "LAFMAX", "LAFMAXTIME", "LAFMIN", "LAFMINTIME", "LAIMAX", "LAIMAXTIME", "LAIMIN", "LAIMINTIME", "LASMAX", "LASMAXTIME", "LASMIN", "LASMINTIME", "LCFMAX", "LCFMAXTIME", "LCFMIN", "LCFMINTIME", "LCIMAX", "LCIMAXTIME", "LCIMIN", "LCIMINTIME", "LCSMAX", "LCSMAXTIME", "LCSMIN", "LCSMINTIME", "LZFMAX", "LZFMAXTIME", "LZFMIN", "LZFMINTIME", "LZIMAX", "LZIMAXTIME",
                    "LZIMIN", "LZIMINTIME", "LZSMAX", "LZSMAXTIME", "LZSMIN", "LZSMINTIME", "LAPK", "LAPKTIME", "LCPK", "LCPKTIME", "LZPK", "LZPKTIME", "LAE", "LAEQ", "LAEQT80", "LAFTM3", "LAFTM5", "LAIEQ", "LAITM3", "LAITM5", "LCEQ", "LCEQSUBLAEQ", "LEPD", "LEX8H", "LZEQ", "LAVGQ4", "LAVGTHRESHOLD", "TWAQ4", "LAVGQ5", "TWAQ5", "CRITERIONTIMESEC", "LZF10", "LZF50", "LZF90", "LZF95", "LZFVAR", "LCF10", "LCF50", "LCF90", "LCF95", "LCFVAR", "LAF10", "LAF50", "LAF90", "LAF95", "LAFVAR", "OVERLOADTIMESEC", "VARLN", "LEPDVAL", "LEX8HVAL"])

    # Generate random data for each record
    for i in range(num_records):
        # Generate a random ID
        print(f"Generating record {i + 1}...")
        ID = str(uuid.uuid4())
        RESULTID = str(uuid.uuid4())
        BATTERYLOW = "True" if random.randint(0, 1) == 0 else "False"
        DURATIONSEC = random.randint(0, 3600)
        NOTES = ''
        OVERLOAD = "True" if random.randint(0, 1) == 0 else "False"
        PAUSEDURATIONSEC = random.randint(0, 3600)
        RESPONSE = 0
        RUNON = random.randint(100, 1016)

        # Generate a random timestamp in a specific format (you can adjust the format as needed)
        year = random.randint(2023, 2024)
        month = random.randint(1, 12)
        day = random.randint(1, 28)  # Adjust for number of days in the month
        hour = random.randint(0, 23)
        minute = random.randint(0, 59)
        second = random.randint(0, 59)
        STARTDATETIME = str(
            f"{year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}:{second:02d}")
        OCTAVECOUNT = random.randint(1, 26)
        ENDDATETIME = str(
            f"{year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}:{second:02d}")

        # Generate random LAFMAX and LAFMIN values within a specific range (adjust as needed)
        LAFMAX = round(random.uniform(10.0, 90.0), 2)
        LAFMAXTIME = str(
            f"{year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}:{second:02d}")
        LAFMIN = round(random.uniform(5.0, 75.0), 2)
        LAFMINTIME = str(
            f"{year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}:{second:02d}")
        LAIMAX = round(random.uniform(5.0, 75.0), 2)
        LAIMAXTIME = str(
            f"{year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}:{second:02d}")
        LAIMIN = round(random.uniform(5.0, 75.0), 2)
        LAIMINTIME = str(
            f"{year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}:{second:02d}")
        LASMAX = round(random.uniform(5.0, 75.0), 2)
        LASMAXTIME = str(
            f"{year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}:{second:02d}")
        LASMIN = round(random.uniform(5.0, 75.0), 2)
        LASMINTIME = str(
            f"{year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}:{second:02d}")
        LCFMAX = round(random.uniform(5.0, 75.0), 2)
        LCFMAXTIME = str(
            f"{year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}:{second:02d}")
        LCFMIN = round(random.uniform(5.0, 75.0), 2)
        LCFMINTIME = str(
            f"{year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}:{second:02d}")
        LCIMAX = round(random.uniform(5.0, 75.0), 2)
        LCIMAXTIME = str(
            f"{year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}:{second:02d}")
        LCIMIN = round(random.uniform(5.0, 75.0), 2)
        LCIMINTIME = str(
            f"{year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}:{second:02d}")
        LCSMAX = round(random.uniform(5.0, 75.0), 2)
        LCSMAXTIME = str(
            f"{year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}:{second:02d}")
        LCSMIN = round(random.uniform(5.0, 75.0), 2)
        LCSMINTIME = str(
            f"{year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}:{second:02d}")
        LZFMAX = round(random.uniform(5.0, 75.0), 2)
        LZFMAXTIME = str(
            f"{year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}:{second:02d}")
        LZFMIN = round(random.uniform(5.0, 75.0), 2)
        LZFMINTIME = str(
            f"{year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}:{second:02d}")
        LZIMAX = round(random.uniform(5.0, 75.0), 2)
        LZIMAXTIME = str(
            f"{year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}:{second:02d}")
        LZIMIN = round(random.uniform(5.0, 75.0), 2)
        LZIMINTIME = str(
            f"{year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}:{second:02d}")
        LZSMAX = round(random.uniform(5.0, 75.0), 2)
        LZSMAXTIME = str(
            f"{year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}:{second:02d}")
        LZSMIN = round(random.uniform(5.0, 75.0), 2)
        LZSMINTIME = str(
            f"{year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}:{second:02d}")
        LAPK = round(random.uniform(5.0, 75.0), 2)
        LAPKTIME = str(
            f"{year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}:{second:02d}")
        LCPK = round(random.uniform(5.0, 75.0), 2)
        LCPKTIME = str(
            f"{year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}:{second:02d}")
        LZPK = round(random.uniform(5.0, 100.0), 2)
        LZPKTIME = str(
            f"{year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}:{second:02d}")
        LAE = round(random.uniform(5.0, 75.0), 2)
        LAEQ = round(random.uniform(5.0, 75.0), 2)
        LAEQT80 = round(random.uniform(5.0, 75.0), 2)
        LAFTM3 = round(random.uniform(5.0, 75.0), 2)
        LAFTM5 = round(random.uniform(5.0, 75.0), 2)
        LAIEQ = round(random.uniform(5.0, 75.0), 2)
        LAITM3 = round(random.uniform(5.0, 75.0), 2)
        LAITM5 = round(random.uniform(5.0, 75.0), 2)
        LCEQ = round(random.uniform(5.0, 75.0), 2)
        LCEQSUBLAEQ = round(random.uniform(5.0, 75.0), 2)
        LEPD = round(random.uniform(5.0, 75.0), 2)
        LEX8H = round(random.uniform(5.0, 75.0), 2)
        LZEQ = round(random.uniform(5.0, 75.0), 2)
        LAVGQ4 = round(random.uniform(5.0, 75.0), 2)
        LAVGTHRESHOLD = round(random.uniform(5.0, 75.0), 2)
        TWAQ4 = round(random.uniform(5.0, 75.0), 2)
        LAVGQ5 = round(random.uniform(5.0, 75.0), 2)
        TWAQ5 = round(random.uniform(5.0, 75.0), 2)
        CRITERIONTIMESEC = random.randint(0, 3600)
        LZF10 = round(random.uniform(5.0, 75.0), 2)
        LZF50 = round(random.uniform(5.0, 75.0), 2)
        LZF90 = round(random.uniform(5.0, 75.0), 2)
        LZF95 = round(random.uniform(5.0, 75.0), 2)
        LZFVAR = round(random.uniform(5.0, 75.0), 2)
        LCF10 = round(random.uniform(5.0, 75.0), 2)
        LCF50 = round(random.uniform(5.0, 75.0), 2)
        LCF90 = round(random.uniform(5.0, 75.0), 2)
        LCF95 = round(random.uniform(5.0, 75.0), 2)
        LCFVAR = round(random.uniform(5.0, 75.0), 2)
        LAF10 = round(random.uniform(5.0, 75.0), 2)
        LAF50 = round(random.uniform(5.0, 75.0), 2)
        LAF90 = round(random.uniform(5.0, 75.0), 2)
        LAF95 = round(random.uniform(5.0, 75.0), 2)
        LAFVAR = round(random.uniform(5.0, 75.0), 2)
        OVERLOADTIMESEC = random.randint(0, 3600)
        VARLN = round(random.uniform(5.0, 75.0), 2)
        LEPDVAL = round(random.uniform(5.0, 75.0), 2)
        LEX8HVAL = round(random.uniform(5.0, 75.0), 2)

        # Write the data row to the CSV file
        writer.writerow([ID, RESULTID, BATTERYLOW, DURATIONSEC, ENDDATETIME, NOTES, OVERLOAD, PAUSEDURATIONSEC, RESPONSE, RUNON, STARTDATETIME, OCTAVECOUNT, LAFMAX, LAFMAXTIME, LAFMIN, LAFMINTIME, LAIMAX, LAIMAXTIME, LAIMIN, LAIMINTIME, LASMAX, LASMAXTIME, LASMIN, LASMINTIME, LCFMAX, LCFMAXTIME, LCFMIN, LCFMINTIME, LCIMAX, LCIMAXTIME, LCIMIN, LCIMINTIME, LCSMAX, LCSMAXTIME, LCSMIN, LCSMINTIME, LZFMAX, LZFMAXTIME, LZFMIN, LZFMINTIME, LZIMAX, LZIMAXTIME,
                         LZIMIN, LZIMINTIME, LZSMAX, LZSMAXTIME, LZSMIN, LZSMINTIME, LAPK, LAPKTIME, LCPK, LCPKTIME, LZPK, LZPKTIME, LAE, LAEQ, LAEQT80, LAFTM3, LAFTM5, LAIEQ, LAITM3, LAITM5, LCEQ, LCEQSUBLAEQ, LEPD, LEX8H, LZEQ, LAVGQ4, LAVGTHRESHOLD, TWAQ4, LAVGQ5, TWAQ5, CRITERIONTIMESEC, LZF10, LZF50, LZF90, LZF95, LZFVAR, LCF10, LCF50, LCF90, LCF95, LCFVAR, LAF10, LAF50, LAF90, LAF95, LAFVAR, OVERLOADTIMESEC, VARLN, LEPDVAL, LEX8HVAL])

print(
    f"Successfully generated {num_records} records and saved to {filename}.csv")

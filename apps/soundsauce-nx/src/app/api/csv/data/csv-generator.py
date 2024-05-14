import csv
import random

# Define the number of records to generate
num_records = 20000

# Open the CSV file for writing
with open('20k.csv', 'w', newline='') as csvfile:
    # Create a CSV writer object
    writer = csv.writer(csvfile)

    # Write the header row
    writer.writerow(['ID', 'ENDTIME', 'LAFMAX', 'LAFMIN'])

    # Generate random data for each record
    for i in range(num_records):
        # Generate a random ID
        ID = i
        print(f"Generating record {i + 1}...")
        # Generate a random timestamp in a specific format (you can adjust the format as needed)
        year = random.randint(2023, 2024)
        month = random.randint(1, 12)
        day = random.randint(1, 28)  # Adjust for number of days in the month
        hour = random.randint(0, 23)
        minute = random.randint(0, 59)
        second = random.randint(0, 59)
        ENDTIME = f"{year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}:{second:02d}"

        # Generate random LAFMAX and LAFMIN values within a specific range (adjust as needed)
        LAFMAX = random.uniform(10.0, 20.0)
        LAFMIN = random.uniform(5.0, 15.0)

        # Write the data row to the CSV file
        writer.writerow([ID, ENDTIME, LAFMAX, LAFMIN])

print(f"Successfully generated {num_records} records and saved to 10k.csv")

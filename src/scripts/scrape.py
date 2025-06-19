import pymupdf
import json
from itertools import islice


# Creates an output.txt file with the contents of the grade distributions
doc = pymupdf.open("src/pdf/grd20251EN.pdf") # open a document

# This does one page with the break statement
with open("src/scripts/output.txt", "wb") as out: # create a text output
    for page in doc: # iterate the document pages
        text = page.get_text().encode("utf8") # get plain text (is in UTF-8)
        out.write(text) # write text of page
        out.write(bytes((12,))) # write page delimiter (form feed 0x0C)
        break
    # break
    # i += 1
    # if i == 2:
    #     break


yr = ""
# Getting the year
with open("src/scripts/output.txt", "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if i == 2:  # 3rd line (0-based index)
            items = line.strip().split()
            # Assuming format: "GRADE DISTRIBUTION REPORT FOR SPRING 2025"
            term = items[-2][:3].upper()  # SPR
            curr_year = items[-1]             # 2025
            yr = f"{curr_year}-{term}"
            break

# Rest of the entries
data = []
start_line = 39
seen_courses = {}
line_buffer = []
curr_entry = None
skip = 0  # Number of lines to skip if we're in a COURSE TOTAL block

with open("src/scripts/output.txt", "r", encoding="utf-8") as f:
    lines = islice(f, start_line-1, None)

    for line in lines:
        line = line.strip()

        if skip > 0:
            skip -= 1
            continue

        if line == "COURSE TOTAL:":
            skip = 14
            continue

        # Check course (e.g. AERO-200-501)
        if "-" in line and len(line.split("-")) == 3:
            dept, course, section = line.split("-")
            course_key = f"{dept}-{course}"

            if course_key not in seen_courses:
                curr_entry = {
                    "dept_name": dept,
                    "course_num": course,
                    "section_num": [],
                    "A": [],
                    "B": [],
                    "C": [],
                    "D": [],
                    "F": [],
                    "ISUQX": [],
                    "instructor": [],
                    "gpa": [],
                    "year": yr
                }
                data.append(curr_entry)
                seen_courses[course_key] = curr_entry
            else:
                curr_entry = seen_courses[course_key]
            
            # Always append a new section
            curr_entry["section_num"].append(section)
            line_buffer = []

        else:
            # Collect 14 lines of grade/instructor data
            if curr_entry is not None:
                line_buffer.append(line)

                if len(line_buffer) == 14:
                    curr_entry["A"].append(line_buffer[0])
                    curr_entry["B"].append(line_buffer[2])
                    curr_entry["C"].append(line_buffer[4])
                    curr_entry["D"].append(line_buffer[6])
                    curr_entry["F"].append(line_buffer[8])
                    curr_entry["gpa"].append(float(line_buffer[11]))
                    # try:
                    #     curr_entry["gpa"].append(float(line_buffer[11]))
                    # except ValueError:
                    #     curr_entry["gpa"].append(None)
                    curr_entry["ISUQX"].append(line_buffer[12].split()[:5])
                    curr_entry["instructor"].append(line_buffer[13])
                    line_buffer = []


# print(data)

# Creates JSON file
with open("profiles.json", "w") as f:
    json.dump(data, f, indent=4)

out.close()
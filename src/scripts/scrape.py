import pymupdf
import json
import os

# All pdfs are parsed through
for filename in os.listdir("src/pdf"):
    # Extract PDF text to output.txt
    doc = pymupdf.open(f"src/pdf/{filename}")

    with open("src/scripts/output.txt", "wb") as out:
        for page in doc:
            text = page.get_text().encode("utf8")
            out.write(text)
            out.write(bytes((12,)))  # Form feed (page delimiter)

    # Get year/term from header
    with open("src/scripts/output.txt", "r", encoding="utf-8") as f:
        for i, line in enumerate(f):
            if i == 2:
                items = line.strip().split()
                term = items[-2][:3].upper()  # e.g., SPR
                curr_year = items[-1]         # e.g., 2025
                yr = f"{curr_year}-{term}"
                break

    # Parse all pages 
    with open("src/scripts/output.txt", "r", encoding="utf-8") as f:
        full_text = f.read()

    pages = full_text.split("\f")  # Split by page

    data = []
    seen_courses = {}
    curr_entry = None
    line_buffer = []

    for page in pages:
        lines = page.strip().splitlines()
        content_lines = lines[38:]  # Skip header

        # Skip pages without any course sections
        has_course_sections = any("-" in line and len(line.split("-")) == 3 for line in content_lines)
        if not has_course_sections:
            continue  # Skip summary-only page

        skip = 0

        for line in content_lines:
            line = line.strip()

            if line == "COURSE TOTAL:":
                skip = 14
                continue

            if skip > 0:
                skip -= 1
                continue

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

                curr_entry["section_num"].append(section)
                line_buffer = []  # Reset when new section starts

            else:
                if curr_entry is not None:
                    line_buffer.append(line)
                    if len(line_buffer) >= 14:
                        curr_entry["A"].append(line_buffer[0])
                        curr_entry["B"].append(line_buffer[2])
                        curr_entry["C"].append(line_buffer[4])
                        curr_entry["D"].append(line_buffer[6])
                        curr_entry["F"].append(line_buffer[8])

                        # Dynamic GPA detection
                        gpa = None
                        for i in range(10, 14):
                            try:
                                gpa_candidate = float(line_buffer[i])
                                if 0.0 <= gpa_candidate <= 4.0:
                                    gpa = gpa_candidate
                                    break
                            except:
                                continue
                        curr_entry["gpa"].append(gpa)

                        # ISUQX detection
                        isuqx_found = False
                        for i in range(11, 14):
                            parts = line_buffer[i].split()
                            if len(parts) >= 5 and all(part.isdigit() for part in parts[:5]):
                                curr_entry["ISUQX"].append(parts[:5])
                                isuqx_found = True
                                break
                        if not isuqx_found:
                            curr_entry["ISUQX"].append(["0", "0", "0", "0", "0"])

                        # Instructor detection with exclusions
                        instructor = None
                        exclusion_keywords = ["COURSE TOTAL:", "DEPARTMENT TOTAL:"]
                        for i in range(len(line_buffer)-1, -1, -1):
                            line = line_buffer[i].strip()
                            if any(c.isalpha() for c in line) and line not in exclusion_keywords:
                                instructor = line
                                break

                        if instructor:
                            curr_entry["instructor"].append(instructor)
                        else:
                            curr_entry["instructor"].append("Unknown")

                        line_buffer = []  # Reset after section processed

    # Write to JSON
    # ex. grdSPR2025.json
    with open(f"{filename[:10]}.json", "w") as f:
        json.dump(data, f, indent=4)

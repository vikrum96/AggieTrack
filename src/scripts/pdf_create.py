import os
import requests
from PyPDF2 import PdfMerger
#pip install requests PyPDF2

semesters = {1: "SPR", 2: "SUM", 3: "FAL"}
departments = ["AG", "AR", "AT", "GB", "BA", "ED", "EN", "SL", "MD", "MS", "NS", "PH", "VF", "VM"]

pdf_output_dir = os.path.join(os.path.dirname(__file__), "..", "pdf")
os.makedirs(pdf_output_dir, exist_ok=True)

for year in range(2016, 2025):
    for term in range(1, 4):
        if year == 2024 and term == 3:
            continue

        term_code = f"{year}{term}"
        prefix = f"grd{term_code}"
        pdfs_to_merge = []

        print(f"Processing {semesters[term]} {year}...")

        for dept in departments:
            url = f"https://web-as.tamu.edu/GradeReports/PDFReports/{term_code}/{prefix}{dept}.pdf"
            local_pdf = f"{prefix}{dept}.pdf"

            try:
                response = requests.get(url)
                response.raise_for_status()
                with open(local_pdf, "wb") as f:
                    f.write(response.content)
                pdfs_to_merge.append(local_pdf)

                print(f"  Downloaded: {local_pdf}")
            except requests.RequestException as e:
                print(f"  Failed to download {url} ({e})")

        # Merge
        if pdfs_to_merge:
            merger = PdfMerger()
            for pdf in pdfs_to_merge:
                merger.append(pdf)

            merged_filename = f"grd{semesters[term]}{year}.pdf"
            merged_path = os.path.join(pdf_output_dir, merged_filename)
            merger.write(merged_path)
            merger.close()

            print(f"  Merged to: {merged_path}")

            # Delete individual PDFs after merge
            for pdf in pdfs_to_merge:
                os.remove(pdf)
            print(f"  Deleted temporary files.\n")
        else:
            print(f"  No PDFs downloaded for {semesters[term]} {year}, skipping merge.\n")

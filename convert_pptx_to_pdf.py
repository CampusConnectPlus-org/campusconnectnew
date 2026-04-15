import os
from win32com.client import Dispatch

pptx_path = os.path.abspath('CampusConnect_Project_Presentation.pptx')
pdf_path = os.path.abspath('CampusConnect_Project_Presentation.pdf')
print('PPTX:', pptx_path)
print('PDF:', pdf_path)

ppt_app = Dispatch('PowerPoint.Application')
ppt_app.Visible = True
presentation = ppt_app.Presentations.Open(pptx_path, WithWindow=False)
presentation.SaveAs(pdf_path, FileFormat=32)
presentation.Close()
ppt_app.Quit()
print('Converted to PDF successfully')

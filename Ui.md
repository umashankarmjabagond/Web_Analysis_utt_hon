# UI Workflow
 
## 1. Drag Data Source
 
1. Drag the data source into the design area.
2. Right-click the data source to open the context menu.
   - Configure
   - Connections
   - Execute
   - View Data
 
## 2. Configure Data Source Modal: None
 
1. Select Data Source: **None** | Testfile
2. Controller Type: Regulator | MPC
3. Template Type:
   1. Regulator
      1. Standalone Controller
      2. Cascade
      3. Instrument
      4. Analyzers
   2. MPC
      1. RMPCT
      2. DMC
      3. Generic APC
      4. Inferentials
4. Select Tags
 
## 3. Standalone Controller
 
### 3.1 Left Side
 
- Click the Add All button.
- Keep tags in the JSON file, for example: `Standalone: {}`
 
| Column Name | Extension |
| --- | --- |
| MODE | .MODE |
| PV | .PV |
| OP | .OP |
| SP | .SP |
| Required Flag | .REQ |
| Time Selected | .TIMESEL |
| Disposability | .DISP |
| Saturation | .SAT |
| Disturbance Variable | .DV |
| Selector Output | .SEL |
| PV Status | .PVSTATUS |
| OPCDA Gain | .GAIN |
| OPCDA Integral Time | .TI |
| OPCDA Derivative Time | .TD |
| OPCDA Derivative Filter | .DFILT |
| OPCDA PV Filter | .PVFILT |
 
### 3.2 Right Side
 
- Add the following tags as mandatory tags:
 
| Column Name | Extension |
| --- | --- |
| MODE | .MODE |
| PV | .PV |
| OP | .OP |
| SP | .SP |
 
- Add tags manually.
 
## 4. Configure Data Source Modal: Text File
 
1. Select Data Source: Testfile
2. Select Controller Type: Regulator | MPC
3. Select Template Type:
 
- Read selected tags from the file header and map them under **Select Tags**.

dataSource.json
                          │
                          │ import
                          ▼
                dataSourceConfiguration
                          │
          ┌───────────────┼────────────────┐
          │               │                │
          ▼               ▼                ▼
     dataSources    controllerTypes   templateTypes
                                           │
                                           ▼
                                    selected controller
                                           │
                                           ▼
                                    selected template
                                           │
                                           ▼
                                    tagDefinitions
                                           │
                                           ▼
                                     availableTags
                                           │
                         ┌─────────────────┴──────────────┐
                         │                                │
                         ▼                                ▼
                    Select Tags                    selectedTags
                      LEFT SIDE                     RIGHT SIDE
                         │                                ▲
                         │          user clicks +         │
                         └────────────────────────────────┘
                         
                         ![alt text](image.png)
 
## Actions
 
- Save
- Cancel
- Help
- Remove All
- Settings
- Close
- Add All
 
### Save Request
 
Request body:
 
```json
{
  "elementType": "DataSource",
  "tagMap": {
    "PV": "",
    "SP": "",
    "OP": "",
    "MODE": ""
  },
  "ParentNames": null,
  "Name": "Generated Name | DataSource_UUID/Timestamp",
  "properties": {
    "samples": 1440,
    "interval": 60
  }
}
```
 
- Properties are read from the JSON file.
- Keep the folder path in settings: `D:/AD/Elements`
- Backend: Create/Read the DataSource JSON file under the Elements folder with the name `DataSource_UUID/Timestamp`, then send that name to the UI as the response for further use.
 
Response body:
 
```json
{
  "status": 200,
  "name": "DataSource_UUID/Timestamp",
  "message": ""
}
```
 
- The UI should save that ID to read it later.
- The same behavior applies to Connected and DPP.
 
## Notes
 
- Use consistent naming for tag fields and extensions.
- Review the selected tags before saving the configuration.
- Confirm that the controller type and template type match the intended process configuration.
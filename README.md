
# Functional Requirements

| Category              | Functional Requirements                                                                                                       |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Input processing      | Limit input at 3 characters by preventing inputs from crossing beyond 3 characters                                            |
|                       | Reject characters that are not 0-9 and A-F                                                                                    |
|                       | Process text string through HEX to DEC numbers for processing                                                                 |
|                       | Store processed input into client storage for caching                                                                         |
| Output processing     | Process output number from DEC to HEX as string                                                                               |
|                       | Ignore processing for digits after decimal during conversion                                                                  |
|                       | Limit output string characters to 6 characters by trimming from right to left                                                 |
|                       | Process negative output, Infinity and NaN answers as Errors                                                                   |
| Arithmetic Operations | Store input for each operation pressed in order to apply operations to current input and stored input                         |
|                       | Contain operations for Add, Subtract, Multiply and Divide                                                                     |
|                       | Contain operations for storing special storage (stored in backend side)                                                       |
|                       | Execute operations in the backend                                                                                             |
|                       | Adding new operations without pressing Equals in order to chain them will precalculate the result and store it into the cache |
| Calculator operations | Equals button to execute current operation to calculate result                                                                |
|                       | Clear button to clear input                                                                                                   |
|                       | Clear button to clear cache storage                                                                                           |
| GUI                   | Have buttons for each operation clickable to perform operations                                                               |
|                       | Display input and output in a display box                                                                                     |
|                       | Display cached data in a seperate display box, along with the last operation                                                  |
| Database              | Store the last operations and answers in a database                                                                           |
|                       | Load database to client side when needing to display history                                                                  |

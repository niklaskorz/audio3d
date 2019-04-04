/**
 * @author Niklas Korz
 */

// Options for configuring the file modal
export interface OpenFileDialogOptions {
  accept?: string;
}

/**
 * Opens a file dialog and lets the user select a file
 * @returns The selected file
 */
export const openFileDialog = (
  options: OpenFileDialogOptions = {}
): Promise<File> =>
  new Promise(resolve => {
    const input = document.createElement("input");
    input.type = "file";
    if (options.accept) {
      input.accept = options.accept;
    }
    input.onchange = () => {
      if (input.files) {
        resolve(input.files[0]);
      }
    };
    input.click();
  });

import fs from "node:fs/promises";

(async () => {
  // commands
  const CREATE_FILE = "create a file";
  const DELETE_FILE = "delete a file";
  const RENAME_FILE = "rename a file";
  const ADD_TO_FILE = "add to file";

  const createFile = async (path) => {
    try {
      const existingFileHandle = await fs.open(path, "r");
      existingFileHandle.close();
      return console.log(`The file ${path} already exist.`);
    } catch (e) {
      const newFileHandle = await fs.open(path, "w");
      newFileHandle.close();
      return console.log(`A new file was successfully created.`);
    }
  };

  const deleteFile = async (path) => {
    try {
      await fs.unlink(path);
      return console.log(`The file ${path} was deleted successfully.`);
    } catch (e) {
      return console.log(`There was an error while deleting your file.`);
    }
  };
  const renameFile = async (oldPath, newPath) => {
    try {
      await fs.rename(oldPath, newPath);
      return console.log(`The file ${oldPath} was renamed successfully.`);
    } catch (e) {
      return console.log(`There was an error while renaming your file.`);
    }
  };

  let addedContent;
  const addToFile = async (path, content) => {
    if (addedContent == content) return;
    try {
      const fileHandle = await fs.open(path, "a");
      fileHandle.write(content);
      addedContent = content;
      fileHandle.close();
      return console.log(`The content was added successfully.`);
    } catch (e) {
      return console.log(
        `There was an error while adding content to your file.`
      );
    }
  };

  //fileHandler for command file
  const commandFileHandler = await fs.open("./command.txt");
  commandFileHandler.on("change", async () => {
    const fileSize = (await commandFileHandler.stat()).size;
    const buff = Buffer.alloc(fileSize);
    const length = buff.byteLength;
    const offset = 0;
    const position = 0;
    await commandFileHandler.read(buff, offset, length, position);
    const command = buff.toString("utf-8");

    // create a file
    // create a file <path>
    if (command.includes(CREATE_FILE)) {
      const filePath = command.substring(CREATE_FILE.length + 1);
      await createFile(filePath);
    }

    // delete a file
    // delete a file <path>
    if (command.includes(DELETE_FILE)) {
      const filePath = command.substring(DELETE_FILE.length + 1);
      await deleteFile(filePath);
    }

    // rename a file
    // rename a file <path> to <new_path>
    if (command.includes(RENAME_FILE)) {
      const _idx = command.indexOf(" to ");
      const oldFilePath = command.substring(RENAME_FILE.length + 1, _idx);
      const newFilePath = command.substring(_idx + 4);
      await renameFile(oldFilePath, newFilePath);
    }

    // add to file
    // add to file <path> this content: <content>
    if (command.includes(ADD_TO_FILE)) {
      const _idx = command.indexOf(" this content: ");
      const filePath = command.substring(ADD_TO_FILE.length + 1, _idx);
      const content = command.substring(_idx + 15);
      await addToFile(filePath, content);
    }
  });

  // file watcher
  // listening for change is command file
  const watcher = fs.watch("./command.txt");
  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();

// const content = fs.readFileSync("./text.txt");
// console.log(content.toString("utf-8"));

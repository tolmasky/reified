const { existsSync: exists, mkdirSync: mkdir, writeFileSync: write } = require("fs");
const { dirname, join } = require("path");
const mkdirp = filename => mkdir(filename, { recursive: true });

const toURL = tag =>
    `https://raw.githubusercontent.com/tc39/ecma262/${tag}/spec.html`;
const toDestination = tag =>
    join(__dirname, "specifications", tag, "specification.html");


module.exports = async function
({
    tag = "es2022",
    overwrite = false
}, destination = toDestination(tag))
{
    if (exists(destination) && !overwrite)
        console.log("Specification already exists at location.");

    else
    {
        const response = await fetch(toURL(tag));

        mkdirp(dirname(destination));
        write(destination, await response.text(), "utf-8");
    }

    return destination;
}

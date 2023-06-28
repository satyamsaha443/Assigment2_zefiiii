function replaceStringVariables(fullString: string, data: { [x: string]: string }) {
  const regex = /(^|\n)([^#\n]*\${(\w+)})/g;
  const missingFields: string[] = [];
  const replacedString = fullString.replace(regex, (match, preceding, variable, key) => {
    if (!data[key]?.length) {
      missingFields.push(variable.substring(1));
    }
    return `${preceding}"${data[key]}"`;
  });

  if (missingFields.length) {
    console.log(
      `\nFollowing environment variables in the template file\n` +
      `does not contain values from remote source.\n` +
      `Remove them from env file or provide value in the Hashicorp vault.\n\n` +
      `${missingFields.join("\n")}`
    );
    throw new Error("internal::INVALID_TEMPLATE_OR_SECRETS");
  } else {
    return replacedString;
  }
}

const input = `PG_DATABASE=\${DB}\n#PG_HOST=\${HOST}`;
const output = replaceStringVariables(input, {
  DB: "postgres",
  PG_HOST: "localhost"
});
console.log(output);

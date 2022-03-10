# rice-ball
Tool to remove code based on specific comments from node.js

## install
```shell
yarn add -D rice-ball
```

## Configuration
Create rice-ball.json in the root directory of the project.

```json
{
  "dirs": [
    "src"
  ],
  "extensions": [
    "ts",
    "js",
    "php",
    "py",
    "scss",
    "css"
  ]
}
```

### dirs
Specify the directory to be searched for files.
※ Multiple designations are possible.

### extensions
Specify the extension to be searched.

The above are the only extensions that have been tested, but any text file extension can be executed.

## Usage

### Box in code delete

Add a comment with a flag for code like the following.

```typescript
async function main() {
  /* rice-ball start example-flag */
  const some = 930316
  /* rice-ball end example-flag */
}
```

Select the flag and enter to perform rice-ball..

```
? Please choice delete flag. … 
❯ example-flag
```

Execution result.

```typescript
async function main() {
}
```

#### Ignore

Ignore comments can make the deletion be ignored.

```php
<?php

declare(strict_types=1);

function example() {
    $scream = '高田憂希しか好きじゃない';
    /** rice-ball start example-flag-php */
    /** rice-ball ignore start */
    echo($scream);
    /** rice-ball ignore end */
    /** rice-ball end example-flag-php */
}
```

Execution result.

```php
<?php

declare(strict_types=1);

function example() {
    $scream = '高田憂希しか好きじゃない';
    echo($scream);
}
```

### One line code delete

Delete one line.

```typescript
console.log('rice-ball') // rice-ball line example-flag 
```

### File delete

Delete file by file.

```typescript
/* rice-ball file example-flag */
export default class DeleteClass {}
```

### Support file extension

As mentioned above, basically everything works for text files, 
but the extensions for which we have confirmed actual operation are as follows

- .ts 
- .tsx
- .php
- .js
- .jsx
- .py
- .scss
- .css
- .txt
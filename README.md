# CANDDi Signature

A Chrome Extension that allows you to add a HTML signature to Gmail Emails

## Development

### Installation

Follow instructions [here](https://developer.chrome.com/extensions/getstarted#unpacked). You'll need to point to `src/` directory.

### Development

To bump a version:

    grunt bump:[major|minor|patch]

(where versions are formatted as `<major>.<minor>.<patch>`)

### Testing

To run jsHint:

    grunt

### Build

Built to `target/`.

Version will NOT be bumped automatically. To bump the version automatically, add:
`--major`, `--minor` or `--patch`

To build for the web store or development distribution:

    grunt build

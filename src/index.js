import parser from 'solidity-parser-antlr'
import {argv} from 'yargs'
import path from 'path'
import fs from 'fs'
import R from 'ramda'

const mapIndexed = R.addIndex (R.map)
const notEquals = R.complement(R.equals)

const check = files_asts => {
  mapIndexed ((file_asts, fileIdx) => {
    console.log (`file_asts.path`, file_asts.path)
    R.map (ast => {
      /* Compare AST to every AST in every file before this one */
      R.map (_file_asts => {
        R.map (_ast => {
          ast.name === _ast.name && do {
            if (notEquals (ast, _ast)) {
              console.log (`ast`, ast)
              console.log (`_ast`, _ast)
              throw new Error (`Not equal`)
            }
          }
        }, _file_asts.asts)
      }, R.slice (0, fileIdx, files_asts))
    }, file_asts.asts)
  }, files_asts)
} 


const absPaths = R.map (path.resolve, argv._)
const files_string = R.map (_ => ({
  path: _,
  string: fs.readFileSync(_, `utf8`),
}), absPaths)

try {
  const files_asts = R.map (s => ({
    path: s.path,
    asts: parser.parse (s.string).children |> R.reject (R.propEq (`type`, `PragmaDirective`), #),
  }), files_string)
  check (files_asts)
  console.log (`No errors found!`)
} catch (e) {
  if (e instanceof parser.ParserError) {
    console.log(e.errors)
  } else {
    throw new Error (e)
  }
}
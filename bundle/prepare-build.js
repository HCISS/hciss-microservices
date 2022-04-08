import { exec } from 'child_process'

// this required due to lerna's inability to handle additional args on npm clients.
exec(`npm config set legacy-peer-deps true`)

const packages = ['subscription', 'email', 'api_gateway', ]
packages.forEach((p) => exec(`cp -R protofiles ./packages/${p}`))

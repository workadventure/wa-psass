import { lstatSync, readdirSync } from 'fs';
import { defineConfig } from "vite";
import { getMaps, getMapsOptimizers, getMapsScripts } from "wa-map-optimizer-vite";

const maps = getMaps();

const isDirectory = (path: string) => {
  const stats = lstatSync(path)
  return stats.isDirectory()
}

const getAllFromDirectory = (directoryName: string, wantedExtension: string | null = null) => {
    const fileList: { [p: string]: string } = {}
    const files = readdirSync(directoryName)
  
    if (typeof files !== 'undefined') {
      for (let i = 0; i < files.length; i++) {
        const path = directoryName + '/' + files[i]
        if (isDirectory(path)) {
          const filesFromDir = getAllFromDirectory(directoryName + '/' + files[i], wantedExtension) as unknown as string
          const keys = Object.keys(filesFromDir)
          for (let j = 0; j < keys.length; j++) {
            fileList[keys[j]] = Object.values(filesFromDir)[j]
          }
        } else {
          const key = 'view_' + files[i].split('.')[0]
          const extension = files[i].split('.')[1]
          if (!wantedExtension || extension === wantedExtension) {
            fileList[key] = './' + path
          }
        }
      }
    }
    return fileList
  }

export default defineConfig({
    base: "./",
    build: {
        rollupOptions: {
            input: {
                index: "./index.html",
                ...getAllFromDirectory('public', 'html'),
                ...getMapsScripts(maps),
            },
        },
    },
    plugins: [...getMapsOptimizers(maps)],
    server: {
        host: "localhost",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
            "Cache-Control": "no-cache, no-store, must-revalidate",
        },
        open: "/",
    },
});

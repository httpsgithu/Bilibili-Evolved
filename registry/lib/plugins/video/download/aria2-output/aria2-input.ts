import { DownloadPackage } from '@/core/download'
import { UserAgent } from '@/core/utils/constants'
import { getFriendlyTitle } from '@/core/utils/title'
import { DownloadVideoOutput } from '../../../../components/video/download/types'

export const aria2Input: DownloadVideoOutput = {
  name: 'aria2',
  displayName: 'aria2 Input',
  description: '使用 aria2 命令行输入文件开始下载. (aria2c -i xxx.txt)',
  runAction: async action => {
    const { infos } = action
    const referer = document.URL.replace(window.location.search, '')
    const items = infos
      .map(info => {
        const fragmentItems = info.titledFragments
          .map(f => ({
            url: f.url,
            params: {
              referer,
              userAgent: UserAgent,
              out: f.title,
            },
          }))
          .flat()
        return fragmentItems.map(f => {
          const params = Object.entries(f.params)
            .map(([key, value]) => `  ${lodash.kebabCase(key)}=${value}`)
            .join('\n')
          return `${f.url}\n${params}`
        })
      })
      .flat()
    const input = `
# Generated by Bilibili Evolved Video Export
# https://github.com/the1812/Bilibili-Evolved/
${items.join('\n')}`.trim()
    await DownloadPackage.single(`${getFriendlyTitle()}.txt`, input)
  },
}
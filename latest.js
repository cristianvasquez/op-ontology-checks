import got from 'got'

const lookupLatestRelease = async (owner, repo) => {
  try {
    const response = await got(
      `https://api.github.com/repos/${owner}/${repo}/releases/latest`, {
        responseType: 'json', headers: {
          'User-Agent': 'Your-User-Agent',
        },
      })
    return {
      tag: response.body.tag_name, tarball_url: response.body.tarball_url,
    }
  } catch (error) {
    console.error('Error getting latest release asset URL:', error.message)
    throw error
  }
}

const owner = 'OP-TED'
const repo = 'ePO'
const release = await lookupLatestRelease(owner, repo)
console.log('Latest release:', release)

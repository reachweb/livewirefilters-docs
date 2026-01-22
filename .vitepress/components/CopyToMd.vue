<script setup>
import { ref } from 'vue'
import { useData } from 'vitepress'

const { frontmatter, page } = useData()
const isHome = frontmatter.value.layout === 'home'
const copied = ref(false)

function htmlToMarkdown(element) {
  let markdown = ''

  function processNode(node, listDepth = 0, listType = null, listIndex = 1) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return ''
    }

    const tag = node.tagName.toLowerCase()

    // Skip certain elements
    if (tag === 'button' || node.classList.contains('copy') ||
        node.classList.contains('line-numbers-wrapper') ||
        node.classList.contains('vp-copy-code-button') ||
        tag === 'script' || tag === 'style') {
      return ''
    }

    let result = ''

    switch (tag) {
      case 'h1':
        result = '\n# ' + getTextContent(node) + '\n\n'
        break
      case 'h2':
        result = '\n## ' + getTextContent(node) + '\n\n'
        break
      case 'h3':
        result = '\n### ' + getTextContent(node) + '\n\n'
        break
      case 'h4':
        result = '\n#### ' + getTextContent(node) + '\n\n'
        break
      case 'h5':
        result = '\n##### ' + getTextContent(node) + '\n\n'
        break
      case 'h6':
        result = '\n###### ' + getTextContent(node) + '\n\n'
        break
      case 'p':
        result = processChildren(node) + '\n\n'
        break
      case 'pre':
        const codeEl = node.querySelector('code')
        if (codeEl) {
          const lang = Array.from(codeEl.classList)
            .find(c => c.startsWith('language-'))
            ?.replace('language-', '') || ''
          result = '\n```' + lang + '\n' + codeEl.textContent.trim() + '\n```\n\n'
        } else {
          result = '\n```\n' + node.textContent.trim() + '\n```\n\n'
        }
        break
      case 'code':
        // Inline code (not inside pre)
        if (node.parentElement?.tagName.toLowerCase() !== 'pre') {
          result = '`' + node.textContent + '`'
        }
        break
      case 'strong':
      case 'b':
        result = '**' + processChildren(node) + '**'
        break
      case 'em':
      case 'i':
        result = '*' + processChildren(node) + '*'
        break
      case 'a':
        const href = node.getAttribute('href')
        const text = getTextContent(node)
        if (href && text) {
          result = '[' + text + '](' + href + ')'
        } else {
          result = text
        }
        break
      case 'ul':
        result = '\n' + processListItems(node, listDepth, 'ul') + '\n'
        break
      case 'ol':
        result = '\n' + processListItems(node, listDepth, 'ol') + '\n'
        break
      case 'li':
        const indent = '  '.repeat(listDepth)
        const prefix = listType === 'ol' ? `${listIndex}. ` : '- '
        result = indent + prefix + processChildren(node).trim() + '\n'
        break
      case 'blockquote':
        const quoteContent = processChildren(node).trim().split('\n').map(line => '> ' + line).join('\n')
        result = '\n' + quoteContent + '\n\n'
        break
      case 'br':
        result = '\n'
        break
      case 'hr':
        result = '\n---\n\n'
        break
      case 'table':
        result = processTable(node)
        break
      case 'div':
        // Handle info/warning boxes
        if (node.classList.contains('info') || node.classList.contains('tip')) {
          result = '\n> **Info:** ' + processChildren(node).trim() + '\n\n'
        } else if (node.classList.contains('warning')) {
          result = '\n> **Warning:** ' + processChildren(node).trim() + '\n\n'
        } else if (node.classList.contains('danger')) {
          result = '\n> **Danger:** ' + processChildren(node).trim() + '\n\n'
        } else {
          result = processChildren(node)
        }
        break
      default:
        result = processChildren(node)
    }

    return result
  }

  function getTextContent(node) {
    return node.textContent.trim()
  }

  function processChildren(node) {
    let result = ''
    node.childNodes.forEach(child => {
      result += processNode(child)
    })
    return result
  }

  function processListItems(node, depth, type) {
    let result = ''
    let index = 1
    node.childNodes.forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE && child.tagName.toLowerCase() === 'li') {
        const indent = '  '.repeat(depth)
        const prefix = type === 'ol' ? `${index}. ` : '- '
        let liContent = ''
        child.childNodes.forEach(liChild => {
          if (liChild.nodeType === Node.ELEMENT_NODE &&
              (liChild.tagName.toLowerCase() === 'ul' || liChild.tagName.toLowerCase() === 'ol')) {
            liContent += '\n' + processListItems(liChild, depth + 1, liChild.tagName.toLowerCase())
          } else {
            liContent += processNode(liChild)
          }
        })
        result += indent + prefix + liContent.trim() + '\n'
        index++
      }
    })
    return result
  }

  function processTable(table) {
    let result = '\n'
    const rows = table.querySelectorAll('tr')

    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('th, td')
      const rowContent = Array.from(cells).map(cell => getTextContent(cell)).join(' | ')
      result += '| ' + rowContent + ' |\n'

      // Add header separator after first row
      if (rowIndex === 0) {
        result += '| ' + Array.from(cells).map(() => '---').join(' | ') + ' |\n'
      }
    })

    return result + '\n'
  }

  markdown = processNode(element)

  // Clean up extra whitespace
  markdown = markdown
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  return markdown
}

async function copyToClipboard() {
  const docContent = document.querySelector('.vp-doc')
  if (!docContent) return

  const title = page.value.title || document.querySelector('h1')?.textContent || 'Documentation'
  const url = window.location.href

  // Clone the content to avoid modifying the DOM
  const clone = docContent.cloneNode(true)

  // Remove elements we don't want
  clone.querySelectorAll('.header-anchor, .copy, button, .line-numbers-wrapper').forEach(el => el.remove())

  const markdown = htmlToMarkdown(clone)

  const output = `# ${title.trim()}

${markdown}

---
Source: ${url}`

  try {
    await navigator.clipboard.writeText(output)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<template>
  <div v-if="!isHome" class="copy-to-md-wrapper">
    <button
      class="copy-to-md-btn"
      @click="copyToClipboard"
      :class="{ copied }"
      :title="copied ? 'Copied!' : 'Copy page as Markdown for LLM'"
    >
      <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span class="copy-label">{{ copied ? 'Copied!' : 'Copy to MD' }}</span>
    </button>
  </div>
</template>

<style scoped>
.copy-to-md-wrapper {
  position: relative;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.copy-to-md-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-to-md-btn:hover {
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg-mute);
  border-color: var(--vp-c-brand-1);
}

.copy-to-md-btn.copied {
  color: var(--vp-c-green-1);
  border-color: var(--vp-c-green-1);
}

.copy-to-md-btn svg {
  flex-shrink: 0;
}

.copy-label {
  white-space: nowrap;
}

@media (max-width: 640px) {
  .copy-to-md-wrapper {
    justify-content: center;
  }

  .copy-to-md-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>

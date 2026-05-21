import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { sankey, sankeyLinkHorizontal } from 'd3-sankey'

const YOUTUBE_CATEGORIES = {
  '1': 'Film & Animation',
  '2': 'Autos & Vehicles',
  '10': 'Music',
  '15': 'Pets & Animals',
  '17': 'Sports',
  '20': 'Gaming',
  '22': 'People & Blogs',
  '23': 'Comedy',
  '24': 'Entertainment',
  '25': 'News & Politics',
  '26': 'How-to & Style',
  '27': 'Education',
  '28': 'Science & Technology',
}

function SankeyChart({ data, sessionName = 'Session YouTube', height = 400 }) {
  const ref = useRef()

  useEffect(() => {
    if (!data || data.length === 0) return

    const width = 700
    const margin = { top: 20, right: 160, bottom: 20, left: 20 }

    d3.select(ref.current).selectAll('*').remove()

    const svg = d3.select(ref.current)
      .append('svg')
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)

    const total = data.reduce((sum, d) => sum + d.count, 0)

    const nodes = [
      { name: sessionName },
      ...data.map(d => ({
        name: YOUTUBE_CATEGORIES[d.category_id] || `Catégorie ${d.category_id}`
      })),
      ...data.map(d => ({
        name: `${YOUTUBE_CATEGORIES[d.category_id] || d.category_id}_count`
      }))
    ]

    const nodeIndex = name => nodes.findIndex(n => n.name === name)

    const links = [
      ...data.map(d => ({
        source: nodeIndex(sessionName),
        target: nodeIndex(YOUTUBE_CATEGORIES[d.category_id] || `Catégorie ${d.category_id}`),
        value: d.count
      })),
      ...data.map(d => ({
        source: nodeIndex(YOUTUBE_CATEGORIES[d.category_id] || `Catégorie ${d.category_id}`),
        target: nodeIndex(`${YOUTUBE_CATEGORIES[d.category_id] || d.category_id}_count`),
        value: d.count
      }))
    ]

    const sankeyGen = sankey()
      .nodeWidth(20)
      .nodePadding(15)
      .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]])

    const { nodes: sankeyNodes, links: sankeyLinks } = sankeyGen({
      nodes: nodes.map(d => ({ ...d })),
      links: links.map(d => ({ ...d }))
    })

    const color = d3.scaleOrdinal(d3.schemeTableau10)

    svg.append('g')
      .selectAll('path')
      .data(sankeyLinks)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('fill', 'none')
      .attr('stroke', d => color(d.target.name))
      .attr('stroke-width', d => Math.max(1, d.width))
      .attr('opacity', 0.5)

    svg.append('g')
      .selectAll('rect')
      .data(sankeyNodes)
      .join('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('height', d => Math.max(1, d.y1 - d.y0))
      .attr('width', d => d.x1 - d.x0)
      .attr('fill', d => color(d.name))
      .attr('rx', 4)

    svg.append('g')
      .selectAll('text')
      .data(sankeyNodes)
      .join('text')
      .attr('x', d => d.x0 < width / 2 ? d.x1 + 8 : d.x0 - 8)
      .attr('y', d => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', d => d.x0 < width / 2 ? 'start' : 'end')
      .attr('fill', '#fff')
      .attr('font-size', 12)
      .text(d => {
        if (d.name === sessionName) return d.name
        if (d.name.endsWith('_count')) {
          const count = data.find(item =>
            (YOUTUBE_CATEGORIES[item.category_id] || item.category_id) === d.name.replace('_count', '')
          )?.count || 0
          return `${count} swipes`
        }
        const pct = Math.round((d.value / total) * 100)
        return `${d.name} ${pct}%`
      })

  }, [data, sessionName, height])

  return <div ref={ref} style={{ width: '100%' }} />
}

export default SankeyChart
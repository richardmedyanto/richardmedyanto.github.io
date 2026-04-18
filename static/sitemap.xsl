<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Sitemap</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; max-width: 960px; margin: 48px auto; padding: 0 24px; color: #1a1a1a; }
          h1 { font-size: 1.5rem; font-weight: 600; margin-bottom: 4px; }
          p { color: #666; margin-bottom: 24px; font-size: 0.9rem; }
          table { width: 100%; border-collapse: collapse; }
          th { text-align: left; padding: 10px 16px; background: #f5f5f5; border-bottom: 2px solid #ddd; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; }
          td { padding: 10px 16px; border-bottom: 1px solid #eee; font-size: 0.9rem; }
          tr:hover td { background: #fafafa; }
          a { color: #0066cc; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .date { color: #888; white-space: nowrap; }
        </style>
      </head>
      <body>
        <h1>XML Sitemap</h1>
        <xsl:apply-templates/>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="sitemap:urlset">
    <p><xsl:value-of select="count(sitemap:url)"/> URLs</p>
    <table>
      <tr>
        <th>URL</th>
        <th>Last Modified</th>
      </tr>
      <xsl:for-each select="sitemap:url">
        <tr>
          <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
          <td class="date"><xsl:value-of select="substring(sitemap:lastmod, 1, 10)"/></td>
        </tr>
      </xsl:for-each>
    </table>
  </xsl:template>

  <xsl:template match="sitemap:sitemapindex">
    <p><xsl:value-of select="count(sitemap:sitemap)"/> sitemaps</p>
    <table>
      <tr>
        <th>Sitemap</th>
        <th>Last Modified</th>
      </tr>
      <xsl:for-each select="sitemap:sitemap">
        <tr>
          <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
          <td class="date"><xsl:value-of select="substring(sitemap:lastmod, 1, 10)"/></td>
        </tr>
      </xsl:for-each>
    </table>
  </xsl:template>
</xsl:stylesheet>

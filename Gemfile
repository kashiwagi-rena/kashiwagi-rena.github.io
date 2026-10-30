source "https://rubygems.org"

# GitHub Actions でビルドするので、GitHub Pages の制限に縛られず最新の Jekyll 4 を使える
gem "jekyll", "~> 4.3"

group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-seo-tag"
end

gem "kramdown-parser-gfm" # GitHub と同じ書き方の Markdown を使うため
gem "html-proofer", "~> 5.0" # CI でリンク切れをチェックする

# ローカルで jekyll serve するときに必要（Ruby 3.0 以降は標準添付ではなくなったため）
gem "webrick"

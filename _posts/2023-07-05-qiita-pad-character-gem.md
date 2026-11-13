---
title: "🐾動物言語🐾（pad_character）を『gem』で作ってみた！🐈"
tags: [技術系]
original_site: "Qiita"
original_url: "https://qiita.com/hfslca7439/items/6fda805d95bbd5d2fecc"
---

この記事は、ふぁ○お神様に憧れて、~~中間試験・PF作成を放り投げて~~gem作成に勤しんだ日記です！

gemの内容は、とっても簡単ですのでGitHubに飛んで内容も見て行って下さい。一つのgemの内容がわかるようになると、他のものにも応用ができ、gemを使う際の手助けとなってくれると信じています！

注意：間違い等あるかもしれません！！！気付かれましたら、お手数ですが教えて下さい🐾

## 目次だにゃ🐾

- これを作りました！
- ほぼ、これを参考に作りました🐾
- 私の環境
- 事前準備
- gem作成の大まかな流れ
  - １、[RubyGems](https://rubygems.org/)で、作りたいgemと同じ名前がないか調べましよう！
  - ２、Gemの箱（雛形）を作ります。
  - ３、自分の思うままに中身を作っていきましょう！
  - ４、動作確認をしていきましょう！
  - ５、RSpecを書いて、ちゃんと確認してあげましょう！
  - ６、世に出してあげましょう！
-　上記以外の参考文献
-　公式しか勝たん！
-　最後に

## これを作りました🐾

https://rubygems.org/gems/pad_character

文字を入れると、その数だけ「🐾」が出てくるgemです。

## ほぼ、これを参考に作りました🐾

https://qiita.com/harashoo/items/1284fd5362c1a4f6c8a8#%E4%BD%9C%E3%81%A3%E3%81%9Fgem%E3%82%92%E7%A2%BA%E8%AA%8D%E3%81%97%E3%81%A6%E3%81%BF%E3%82%8B

https://qiita.com/9sako6/items/72994b8b1c00af4e61fe

https://autovice.jp/articles/183

## 私の環境🐾

```text
ruby -v
ruby 3.0.2p107 (2021-07-07 revision 0db68f0233) [arm64-darwin21]

bundle -v
Bundler version 2.2.22
```

## 事前準備🐾

- Githubに今回作るgemのソースコードを置くための新しいリポジトリを作成
- RubyGems
  - アカウント登録
  - API keysの作成（詳しくあとで書く）
  - 仕様が変わっていないか調べる
- Bundler
  - • bundle -v をしてBundler version 1.9.0未満の場合、gem update bundlerしてください。

## 🐾gem作成の大まかな流れ🐾

１、gemの名前は、unique（一意）でなければなりません。[RubyGems](https://rubygems.org/)で、作りたいgemと同じ名前がないか調べましよう！

２、箱（雛形）を作ります。
gemは素晴らしいことに箱（雛形）が用意してあります。これが上手くインストールできたら、あとは穴埋め式に自分がしたいことを入れていくだけ・・・
「TODO：」方式で、書いてあるのも分かりやすくてよかったです。全部埋めるとちゃんとgemになってるので不思議ですね！

３、自分の思うままに中身を作っていきましょう！
PFと一緒で、一旦形にして次に行く方がいいと思います！
PFよりもいくぶんも実装にかかるコストが低いのでどんどん中身を点検・修正・改善して行った方が面白いかなって思います！

４、動作確認をしていきましょう！まずは、gemとして認識させてあげて、「irb」にて動かしてあげましょう！

５、RSpecを書いて、ちゃんと確認してあげましょう！
PFでのテストの練習にもなりますし、いたって簡単です。書いてみましょう！

６、世に出してあげましょう！
（世に出す際のやり方が最近変わったようで、上記に参照していた記事が使えなくなっていました！こういう時は、公式こそ正義です！ちゃんと公式を読みましょう（戒め））

### １、[RubyGems](https://rubygems.org/)で、作りたいgemと同じ名前がないか調べましよう🐾

上記のURLにて、「RubyGems」に飛んで、作りたいアプリの名前を入れてみましょう！
検索に引っ掛からなければ、ないのでそのまま作っていきましょう！
もしひっかかってしまった場合、作れませんので名前を検討しましょう・・・

### ２、Gemの箱（雛形）を作ります🐾

（こちらに関しての自分のデータがなかったのでこちらの[URL](https://qiita.com/harashoo/items/1284fd5362c1a4f6c8a8#gem%E3%81%AE%E3%83%99%E3%83%BC%E3%82%B9%E3%82%92%E4%BD%9C%E6%88%90%E3%81%99%E3%82%8B)を引用します）

> ****Gemのベースを作成する****
>
> Bundlerを使って作成します。Bundler無しでもGemの作成はできますが、現在はBundlerを使うのがスタンダードのような雰囲気があります。
>
> `bundle gem gem_name`で簡単にGemのベースを作成できます。
>

```bash
$ bundle gem (you_gem_name)
```

> `bundle gem`コマンドを初めて使う場合は、テストをRSpecとminitestどちらで書くか、CODE_OF_CONDUCT.mdとLICENSE.txtを作っていいかを確認されます。
>
>
> 「テストをRSpecとminitestどちらで書くか」は慣れている方を選択すれば良いと思います。私はRSpecを選択しています。「CODE_OF_CONDUCT.mdとLICENSE.txtを作っていいか」はYESで良いと思います。
>
>
> CODE_OF_CONDUCT.md
>
> - gemへのすべての貢献者が従うことを期待する行動規範を提供します。
>
> LICENSE.txt
>
> - [MITライセンス](https://ja.wikipedia.org/wiki/MIT_License)が含まれています。

```bash
$ cd  (you_gem_name)
$ tree
.
├── CODE_OF_CONDUCT.md
├── Gemfile
├── Gemfile.lock
├── LICENSE.txt
├── README.md
├── Rakefile
├── bin
│   ├── console
│   └── setup
├── (you_gem_name).gemspec
├── lib
│   ├── (you_gem_name)
│   │   └── version.rb
│   └── (you_gem_name).rb
└── spec
    ├── (you_gem_name)_spec.rb
    └── spec_helper.rb
```

> gem_name.gemspecにはメタデータが定義されています。書き直すべきところは、TODOと書かれているので、これを修正していきます。修正しないと`bundle install`
をしたときに怒られます。
>

***（「TODO：」と、書いてあるので書くところも迷わず書けます！）***

> (you_gem_name).gemspec
>

```ruby
# 書き直すところを抜粋

# Gemの要約を書きます
spec.summary       = %q{TODO: Write a short summary, because RubyGems requires one.}

# Gemの説明を書きます
spec.description   = %q{TODO: Write a longer description or delete this line.}

# ホームページURL or GithubのリポジトリURLを書きます。
spec.homepage      = "TODO: Put your gem's website or public repo URL here."

# https://rubygems.orgを書きます
spec.metadata["allowed_push_host"] = "TODO: Set to 'http://mygemserver.com'"

# GithubのリポジトリURLを書きます。
spec.metadata["source_code_uri"] = "TODO: Put your gem's public repo URL here."

# CHANGELOG.mdのURLを書きます。
spec.metadata["changelog_uri"] = "TODO: Put your gem's CHANGELOG.md URL here."
```

***（説明も英語ですが書いてあるので、訳しながら埋めていってください🐾）***

> このファイルの下部にある次のコードは、依存しているGemが書かれています。
>
>
> これはGemfileから読み込まれていますので、Gemを追加した場合はここに追記しています。
>
>
> (you_gem_name).gemspec
>

```text
spec.add_development_dependency "bundler", "~> 2.0"
spec.add_development_dependency "rake", "~> 10.0"
spec.add_development_dependency "rspec", "~> 3.0"
```

> 修正が終わったら、依存gemをインストールします。

```text
bundle install
```

### ３、自分の思うままに中身を作っていきましょう🐾

（ここからは、私のコードも例に挙げていきます。混ざって分かりにくい場合は教えてください・・・直します）

libディレクトリにコードを書いていきましょう！

```text
touch lib/(you_gem_name)/format_(you_gem_name).rb
```

format_(you_gem_name).rb

```text
class String
#Stringクラスに「to_pad」メゾットを増やしています。とっても単純・・・もっと面白いやつにアップデートしていく予定です。
  def to_pad
    word_count = self.size
    pad_count = "\u{1F43E}" * word_count.to_i
  end
end
```

(これは見本です！好きなように定義していきましょう🐾)

次に(you_gem_name)/format_(you_gem_name).rbを読み込めるようにrequireします！

```text
# frozen_string_literal: true

require_relative "pad_character/version"
require "pad_character/format_pad_character"

module PadCharacter
  class Error < StandardError; end
  # Your code goes here...
end
```

### ４、動作確認をしていきましょう🐾

作ったメソッド（定義）をgemにして動作確認をしていきます！

```text
rake build
```

> コマンドでpkgディレクトリにgemをbuildします。buildが完了したらgem installをします。

```text
% rake build
pad_character 0.1.0 built to pkg/pad_character-0.1.0.gem.

% gem install pkg/pad_character-0.1.0.gem  
Successfully installed pad_character-0.1.0
Parsing documentation for pad_character-0.1.0
Done installing documentation for pad_character after 0 seconds
1 gem installed
```

***こちらのコマンドは、gemのディレクトリに変更した場合都度行ってgemにしてください。確認までした方がいいです。***

installができたら、

```text
% bin/console（irbでもよき！！！）
```

を起動して、確認していきましょう！

```text
irb(main):001:0> require "Pad_character"
=> true

irb(main):002:0> "アイウエオ".to_pad
=> "🐾🐾🐾🐾🐾"
```

**とってもかわいいにくきゅう文字が出来ました🐾**

### ５、RSpecを書いて、ちゃんと確認してあげましょう🐾

> ****テストを書いていく****
>
>
> コードの品質を担保するためにテストを書きましょう。Gemとして公開するなら、なおさら重要ですね。
>
>
> 今回テストはRSpecを使います。
>
gemのテストは簡単に書け・簡単に確認が取れるため、いい練習になると思います。ぜひ書いてみましょう！しかも、RSpecで書いてあることが多いため他のgemのRSpecを見るだけで、結構勉強になります。どこにどんな感じに書いてあるかも見ていってください。

spec/pad_character_spec.rb

```text
# frozen_string_literal: true

RSpec.describe PadCharacter do
  it "入力した文字が全て🐾になる" do
    str = "あいうえお"
    expect(str.to_pad).to eql("🐾🐾🐾🐾🐾")
  end
end
```

書いたら、テストを実行してみましょう🐾

```text
% bundle exec rspec

PadCharacter
  入力した文字が全て🐾になる

Finished in 0.00222 seconds (files took 0.14626 seconds to load)
1 example, 0 failures
```

テストが、通りました🐾

### ６、世に出してあげましょう🐾

上記のURLに従って、アップロードしようとしたら・・・出来ませんでした・・・（泣）

```text
% rake release
pad_character 0.1.0 built to pkg/pad_character-0.1.0.gem.
Tag v0.1.0 has already been created.
Enter your RubyGems.org credentials.
Don't have an account yet? Create one at https://rubygems.org/sign_up
   Email:   you@example.com
Password:   

Signed in with API key: kashiwagireinanoMacBook-Air.local-kashiwagirena-20230228145755.
ERROR:  While executing gem ... (NameError)
    uninitialized constant Gem::ConfigFile::FileUtils
Did you mean?  FileTest
```

errorが出てしまっています・・・なぜ？？？

調べたところ、最近RubyGemsの使用が変わったようです。
RubyGemsにアカウントを作ります。
その後に、下記公式を参考に「API keys」を作ってください。メアド・パスワード・APIが必要とあります

https://guides.rubygems.org/api-key-scopes/

> 実行すると、gem signinRubyGems.org の資格情報、キー名、およびキーを有効にするスコープの入力を求められます。すべてのスコープのデフォルトの選択は、それらを有効にすることではありません。

ルートディレクトリに移動後、下記コマンドを実行して、情報を入れます。
[ y/n ]で聞かれるものは下記と一緒にしてください
***公式にも同じものが書いてあります***

```text
MacBook-Air ~% gem signin
Enter your RubyGems.org credentials.
Don't have an account yet? Create one at https://rubygems.org/sign_up
   Email:   you@example.com
Password:   

API Key name [kashiwagireinanoMacBook-Air.local-kashiwagirena-20230228155124]:   rubygems_xxxxxxxxxxxxxxxx（APIキーは伏せています）
Please select scopes you want to enable for the API key (y/n)
index_rubygems [y/N]:   n
push_rubygem [y/N]:   y
yank_rubygem [y/N]:   n
add_owner [y/N]:   n
remove_owner [y/N]:   n
access_webhooks [y/N]:   n
show_dashboard [y/N]:   n

Signed in with API key: あはは〜〜〜〜！
```

https://guides.rubygems.org/make-your-own-gem/#:~:text=OTP (if enabled)　←公式

```text
MacBook-Air PF % cd pad_character
```

gemのディレクトリに移動後、下記のコマンドにてpushします！

```text
MacBook-Air pad_character % rake build
pad_character 0.1.0 built to pkg/pad_character-0.1.0.gem.

MacBook-Air pad_character % gem push pkg/pad_character-0.1.0.gem
Pushing gem to https://rubygems.org...
Successfully registered gem: pad_character (0.1.0)
```

下記コマンドで、世に出すことができます！

```text
MacBook-Air pad_character % gem list -r pad_character

*** REMOTE GEMS ***

pad_character (0.1.0)
```

***お疲れ様です🐾***

これにて、gemを作成することができました！

https://rubygems.org/gems/pad_character

## 最後に🐈‍⬛

私は技術に関して、苦手意識や理解が追えない部分多いこと、なんなら英語が書いてあるだけで遠ざけてしまう方の人です。全く強くもなければ、中間試験に３ヶ月かけたりしましたw

それでも、プログラミングが楽しいことことに気がつき、私なりの向き合い方ができていると思います。

なので、もし「このまま、卒業できなかったらどうしよう」や「カルキュラムが辛い」と思っている方も大丈夫です！コミュニティで話してみてください。きっと、みんな同じ悩みがあり話を聞いてくれるはず・・・

そして、あなたなりの作りたいものなど探してみてはどうでしょうか？

技術よわよわでも作れるものはきっとあります！そして、それはあなたに自信をつけてくれます！

ダウンロード数が一日で結構いていてテンションあげあげの私より

### 上記以外の参考文献

「ruby 絵文字 ユニコード」で検索かけました。

https://jnst.hateblo.jp/entry/2016/08/25/135420

#### 公式しか勝たん！

https://github.com/rubygems/rubygems/issues/3976

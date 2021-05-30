# これ何
機動戦士ガンダムバトルオペレーション2のレーティングマッチの結果を表示するhtmlです。
dataフォルダ内のcsvを手動更新するとグラフが自動更新されます。
OBS等の配信ソフトのブラウザソースに指定することを想定しています。

# 含まれているもの
## graph_ground.html
地上レートの推移を表示します。`rating_log_ground.csv`の内容が反映されます。
グラフは"その日"の推移のみを表示します。"その日の試合"の特定は、csvの三列目の情報に基づいています。

## graph_space.html
宇宙レートの推移を表示します。`rating_log_space.csv`の内容が反映されます。
グラフの仕様は`graph_ground.html`同様です。

## data/rating_log_ground.csv
地上レートの推移を記録します。UTF-8 BOMなし CrLf改行で入力する必要があります。
戦闘終了時に、以下の情報を半角カンマで区切って入力します。
一列目：現在時刻(ぶっちゃけロジックの中で見てないのでカンマが入ってなければフォーマットは何でも可)
二列目：戦闘終了後のレート
三列目：その日の最後の戦闘なら1、それ以外の戦闘なら0を半角で入力

基本的にWindowsのメモ帳で入力することを想定しています。現在時刻はF5で入力できます。

## data/rating_log_space.csv
宇宙レートの推移を記録します。仕様は`data/rating_log_ground.csv`同様です。

# 使い方
1. data/rating_log_ground.csv(rating_log_space.csv)に現在時刻、現在のレート、1を入力する
とりあえず配信ソフトで映るか試したい場合は飛ばして下さい。
↓みたいな状態になってるとおけ、最後に空行が入っていてもいなくても可。
```
datetime,score,is_last
03:59 2021/05/04,2603,1
```

2. 配信ソフトでgraph_ground.html(graph_space.html)をソースとしたブラウザソースを配置する
幅高さは480x270くらいを推奨。カスタムCSSは空欄にして下さい。

3. グラフが表示されることを確認する
うまく読み込まれれば即座にグラフが表示されるはずです。

4. 戦闘が終わるたびcsvに結果を追加する
新しい行に現在時刻、新しいレート、0を入力。csv全体が以下のようになってるとおけ。
```
datetime,score,is_last
03:59 2021/05/04,2603,1
04:10 2021/05/04,2613,0
```
csvを上書き保存するとグラフに自動反映されます。
反映までの時間は最長で5秒かかります。

5. その日の戦闘を終わる場合は、最終行の3列目を1に書き換えて保存する
書き換えた行のレートが次の日のグラフの基準点になります。


# バージョン
v1.02

# 作者
@lt900ed
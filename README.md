Shopping_web後端api
====
使用node.js + express並使用Mysql作為資料庫的購物網站API

Features - 產品功能
-----
#### Users:

1.使用者可以進行登入功能。

2.使用者可以進行註冊功能。

3.使用者可以取得本帳號資料。

4.使用者可以取得商家資料。

5.使用者可以檢查token權限

6.使用者可修改個人資料

7.使用者可修改密碼

#### Products:

1.顯示所有商品

2.顯示單一商品

3.商品篩選: 金額

4.商品篩選: 名稱

5.商品篩選: 存貨量

6.商品篩選: 分類

7.取得所有商品分類

#### Shopcars(需要買家權限):

1.購物車商品清單

2.商品加入購物車

3.移除購物車商品

4.商品數量增減

5.結帳功能

#### Stores(需要賣家權限):

1.商店的商品清單

2.商店本帳號的商品清單

3.上架商品

4.下架商品功能

5.編輯商品

Environment SetUp - 環境建置
-----
1. [Node.js](https://nodejs.org/en/)
2. [Mysql](https://www.mysql.com/)

Installing - 專案安裝流程
----
1.打開你的 terminal，Clone 此專案至本機電腦

    git clone https://github.com/CHUCHUDAN/shopping_web_backend.git
    
2.開啟終端機(Terminal)，進入存放此專案的資料夾

    cd shopping_web_backend
    
3.安裝 express 套件版本建議4.17.1

    在 Terminal 輸入 npm i express@4.17.1 指令
    
4.安裝nodemon套件
    
    在 Terminal 輸入 npm install nodemon 指令
    
5.請自行新增.env檔案放置與檔案相關的敏感資訊可參考.env.example檔案內容

    JWT_SECRET="你的jwt secret"
    IMGUR_CLIENT_ID="你的imgur client_id"(非必要)
    GITHUB_PAGE="你的指定前端網域"
    SESSION_SECRET="你的 session secret"
    PORT=你的埠號

6.mysql資料庫設定

    請參考專案資料夾中的config/config.json設定，可以照著裡面的設定或自行建立設定本地mysql資料庫。

7.資料庫遷移

    在 Terminal 輸入 npx sequelize db:migrate 指令  
    
8.啟動伺服器
  
    在 Terminal 輸入 npm run dev 指令
    
9.當 terminal 出現以下字樣，表示伺服器啟動成功並與資料庫連線成功

    Example app listening on http://localhost:3000

10.如需使用種子資料請輸入指令

    在 Terminal 輸入 npx sequelize db:seed:all 指令
    
Contributor - 專案開發人員
-----
[Daniel Chu](https://github.com/CHUCHUDAN)
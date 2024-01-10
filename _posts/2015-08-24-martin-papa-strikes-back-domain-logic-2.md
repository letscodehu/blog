---
id: 701
title: 'Martin papa strikes back &#8211; Domain Logic 2.'
date: '2015-08-24T19:15:29+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=701'
permalink: /2015/08/24/martin-papa-strikes-back-domain-logic-2/
dsq_thread_id:
    - '4062879958'
    - '4062879958'
tie_post_bg:
    - ''
    - ''
tie_post_color:
    - ''
    - ''
tie_gallery_style:
    - slider
    - slider
tie_link_url:
    - ''
    - ''
tie_link_desc:
    - ''
    - ''
tie_video_url:
    - ''
    - ''
tie_embed_code:
    - ''
    - ''
tie_audio_mp3:
    - ''
    - ''
tie_audio_m4a:
    - ''
    - ''
tie_audio_oga:
    - ''
    - ''
tie_audio_soundcloud:
    - ''
    - ''
tie_quote_author:
    - ''
    - ''
tie_quote_link:
    - ''
    - ''
tie_quote_text:
    - ''
    - ''
tie_status_facebook:
    - ''
    - ''
tie_status_twitter:
    - ''
    - ''
categories:
    - Backend
    - 'Design Pattern'
tags:
    - 'data source'
    - design
    - 'domain logic'
    - 'domain model'
    - 'table module'
---

Az előző cikk elég kuszára sikerült, úgyhogy most muszáj lesz kárpótolni benneteket. A folytatás témája a Table Module és a Service Layer lesz, amikkel együtt kellő alapot hoztunk létre, hogy továbblépjünk a Data Source patternek felé.![table1](assets/uploads/2015/08/table1-1024x681.jpg)

### Table Module

Az előző részben kitárgyaltuk a Domain Model mintát. Ahogy az objektumorientáltság alapelvei szólnak, az adatot kapcsoljuk össze a funkciókkal. Pontosan emiatt, ebben az esetben minden egyes elemhez tartozott egy objektumpéldány. Tehát ha van száz megrendelés, akkor száz Order objektum kell azok lekezeléséhez. Domain Modelek esetén a legfőbb problémát az jelenti, hogy is kapcsoljuk össze őket relációs adatbázissal.

A Table Module esetében azonban csak egy objektumpéldány fog tartozni egy komplett adatbázis táblához vagy nézethez. Minden egyes sorhoz tartozó logikát ez az egy objektum fogja kezelni.

#### Nézzük meg, hogy mi is rejtőzik a felszín alatt!

[![kitty_rage_quit_table_flip_by_shadethenighthunter-d6qs9le](assets/uploads/2015/08/kitty_rage_quit_table_flip_by_shadethenighthunter-d6qs9le.jpg)](assets/uploads/2015/08/kitty_rage_quit_table_flip_by_shadethenighthunter-d6qs9le.jpg)

A Table Module erőssége, hogy úgy tudjuk hozzácsapni az adatainkat a funkcionalitáshoz, hogy nem veszítjük el a relációs adatbázisok nyújtotta előnyöket. Az objektumunknak nincs fogalma arról, hogy éppen milyen ID-jú entitásokkal dolgozunk. Ennélfogva, ha egy alkalmazottunk címét le akarjuk kérni, akkor egy

```
EmployeeModule::getAddress($id);
```

-hez hasonló metódust használunk. Akármit akarunk csinálni az alkalmazottainkal, valamilyen egyedi azonosítót át kell adjunk. Ez általában a táblában meghatározott primary key.

A Table Module az esetek többségében egy olyan adatszerkezettel dolgozik, ami táblaorientált. A táblázatból kinyert adatok egy SQL kérés eredményei, amit egy Record Set tárol. A Table Module fog számunkra egy interfészt adni, hogy mókoljunk ezekkel az adatokkal.

A legtöbb esetben azonban nem olyan egyszerű a helyzet, hogy egy-egy ilyen osztályt/táblát piszkálunk, hanem több Table Module összedolgozik, ugyanazt a Record Set-et használva.

A Table module lehet osztálypéldány, vagy egy csomó statikus metódus összessége. Ha példányosított osztályról beszélünk, akkor annak előnyeképp mindenképp megemlíthetjük, hogy lehetőséget biztosít egyfajta inicializálásra, például átadhatunk neki egy Record Set-et. Ezután tudod használni a példányt, hogy széttúrd a kapott Record Setet. Ezen felül a példányosítás lehetőséget biztosít az öröklődésre, így pl. írhatunk egy **Recurring** (Turcsán et al.) Order module-t, ami a sima Ordert bővíti ki egyéb funkcionalitásokkal.

<figure aria-describedby="caption-attachment-707" class="wp-caption aligncenter" id="attachment_707" style="width: 402px">[![Átlag Table Module](assets/uploads/2015/08/302463_146975212065031_127279670701252_225549_395422338_n.jpg)](assets/uploads/2015/08/302463_146975212065031_127279670701252_225549_395422338_n.jpg)<figcaption class="wp-caption-text" id="caption-attachment-707">Átlag Table Module</figcaption></figure>

Ha a Table Module hátterében egy Table Data Gateway áll, akkor először ezt használjuk, hogy kinyerjük az adatokat egy Record Set formájába. Ezután példányosítjuk a Table Module-t a Record Set-et átadva argumentumként, ugyanezt a Record Set-et átadhatjuk több Table Module-nak is. Ezután a Table Module molesztálhatja a Record Set-et és átadhatja a presentation layernek megjelenítésre, vagy ún. table-aware widgeteknek. Ezen widgetek nem tudják megmondani, hogy az adott Record Set, amit kaptak, az adatbázisból jött vagy megpiszkáltuk-e azokat. Ha módosításokat végzünk a GUI-n, ugyanez a Record Set visszatér a Table Module felé validálásra, ezután pedig lehet menteni az adatbázisba. Ennek a legnagyobb előnye, hogy a Table Module-t tudod úgy tesztelni, hogy az adatbázishoz hozzá se nyúlsz, csak generálsz egy mock Record Set-et, amit átadsz neki.

Az alábbi képen mindez vizualizálva:

[![Table module](assets/uploads/2015/08/Table-module.png)](assets/uploads/2015/08/Table-module.png)

A Table szó alapján joggal gondolhatnánk, hogy minden egyes táblához tartozik egy Table Module. Ez igaz is, meg nem is, mivel a gyakran használt lekérdezések vagy épp view-k (amik ugye virtuális táblák) szintén kaphatnak hozzájuk tartozó Table Module-t.

#### Használni? Osz'mír?

A Table Module táblázat orientált adathalmazon alapszik, tehát főleg akkor van értelme használni, ha ilyen adatokat nyerünk ki Record Set-ek formájában. Mindennek tetejében az adatstruktúrát helyezi a kód középpontjába, így az adatok elérését minél egyszerűbben akarjuk majd kivitelezni.

Mindenesetre a Table Module komplex logika esetén nem képes a részünkre bocsájtani az objektumok adta előnyök teljes spektrumát. Nem lehet példányok közt kapcsolatot létesíteni, valamint az öröklődés sem működik igazán jól. Tehát a komplikált logika megvalósítására továbbra is a Domain Model lesz a jobb választás.

Ha a Domain Model és az adatbázisban szereplő táblák relative azonosak, akkor az Active Record a megfelelő választás. A Table Module akkor működik jobban a fenti párosításnál, ha az alkalmazásunk többi része is a tábla-orientált adatstruktúrára épül.

A legtöbbet talán .NET-es környezetben lehet belefutni ebbe a mintába, ugyanis itt a Record Set a fő adatforrása az alkalmazásoknak.

Emlékszünk még arra a csodás példára a bevételi kimutatásokkal? Most nézzük, hogy rá tudjuk-e húzni a példára a Table Module mintát és ha igen, akkor hogy is fest?

A Table Module valamilyen adat sémára épül, általában egy relációs adatmodelre, ami esetünkben a következő:[![tables](assets/uploads/2015/08/tables.png)](assets/uploads/2015/08/tables.png)

Az osztályaink, amik ezt az adatot fogják molesztálni ugyanebben a formában lesznek, egy Table Module minden egyes táblára. Először is csináljunk egy TableModule osztályt, amit továbbörökítünk majd. Mivel PHP-ban natív Record Set nélkül nem egyszerű mindezt megoldani, ezért most C#-ban példálózok első körben:

\[tabs type="horizontal"\]\[tabs\_head\]\[tab\_title\]C#\[/tab\_title\]\[/tabs\_head\]\[tab\]

```
    public class TableModule
    {
        protected DataTable table;
        protected TableModule(DataSet ds, String tableName)
        {
            table = ds.Tables[tableName]; // ezt a konstruktort fogjuk meghívni plusz paraméterrel
        }

        protected long GetNextID() // getter a következő ID-nak
        {
            return this.GetNextID();
        }


         protected DataRow this[long key] // létrehozunk egy gettert, ahol használjuk a C# indexerét
        {
            get
            {
                String filter = String.Format("ID = {0}", key);
                return table.Select(filter)[0]; // így a kért index-ű sort adjuk vissza
            }
        }

    }

    class Contract : TableModule
    {
        public Contract(DataSet ds) : base(ds, "Contracts") { } // meghívjuk a szülő konstruktorát és átadjuk neki a tábla nevét

        public long GetProductId(long ContractID) {
            return (long) this[ContractID]["Product"]; // getter a ProductID-nak
        }

        public DateTime GetWhenSigned(long ContractID)
        {
            return (DateTime) this[ContractID]["whenSigned"]; // getter a whenSigned-nek
        }



        public void CalculateRecognitions(long contractID)
        {
            DataRow contractRow = this[contractID]; // lekérjük az adott ID-jú sort
            Decimal amount = (Decimal)contractRow["amount"]; // annak amount mezőjét
            RevenueRecognition rr = new RevenueRecognition(table.DataSet); // meghívjuk a másik TableModule-t
            Product prod = new Product(table.DataSet); // aztán mégegyet - ebben hasonlít a Domain Modelre, igaz?
            long prodID = GetProductId(contractID); // kikérjük a szerződéshez tartozó termék ID-ját
            if (prod.GetProductType(prodID) == ProductType.WP) { // mivel megvan az ID már tudunk rá keresni a Product TableModule-ban
                rr.Insert(contractID, amount, (DateTime) GetWhenSigned(contractID)); // majd a feltételeknek megfelelően legeneráljuk az RR-t és beszúrjuk azt.
            }
            else if (prod.GetProductType(prodID) == ProductType.SS)
            {
                Decimal[] allocation = allocate(amount, 3);
                rr.Insert(contractID, allocation[0], (DateTime) GetWhenSigned(contractID));
                rr.Insert(contractID, allocation[1], (DateTime) GetWhenSigned(contractID).AddDays(60));
                rr.Insert(contractID, allocation[2], (DateTime) GetWhenSigned(contractID). AddDays(90)); 
            } else if (prod.GetProductType(prodID) == ProductType.DB) { 
                Decimal[] allocation = allocate(amount,3); 
                rr.Insert(contractID, allocation[1], (DateTime) GetWhenSigned(contractID));
                rr.Insert(contractID, allocation[1], (DateTime) GetWhenSigned(contractID).AddDays(30));
                rr.Insert(contractID, allocation[2], (DateTime) GetWhenSigned(contractID).AddDays(60));
            } else throw new Exception("invalid product id");
        }

        private Decimal[] allocate(Decimal amount, int by)
        { // a Money objektum helyett most mindez sima Decimallal
            Decimal lowResult = amount / by;
            lowResult = Decimal.Round(lowResult,2);
            Decimal highResult = lowResult + 0.01m; 
            Decimal[] results = new Decimal[by]; 
            int remainder = (int) amount % by; 
            for (int i = 0; i < remainder; i++) 
                results[i] = highResult; 
            for (int i = remainder; i < by; i++) 
                results[i] = lowResult; 
            return results;
        }



    }

    public enum ProductType {WP, SS, DB}; // enum a terméktípusoknak

    class Product : TableModule
    {

        public ProductType GetProductType(long id) {
            String typeCode = (String) this[id]["type"]; // a productType-ot leparse-oljuk és visszaadjuk, sima getter
            return (ProductType) Enum.Parse(typeof(ProductType), typeCode);
        }
        
        public Product(DataSet ds) : base(ds, "Products") { }
    }


    class RevenueRecognition : TableModule
    {
        public RevenueRecognition(DataSet ds) : base(ds, "RevenueRecognition") { }
        
        public long Insert(long contractID, Decimal amount, DateTime date) {
            DataRow newRow = table.NewRow(); // kérünk 1 új sort a táblában
            long id = GetNextID(); // lekérjük az ID-t
            newRow["ID"] = id; 
            newRow["contractID"] = contractID; 
            newRow["amount"] = amount; 
            newRow["date"]= String.Format("{0:s}", date); 
            table.Rows.Add(newRow); // miután feltöltöttük értékekkel, beszúrjuk
            return id;  // és visszaadjuk a beszúrt ID-t
        }

        public Decimal RecognizedRevenue(long contractID, DateTime asOf)
        {
            String filter = String.Format("ContractID = {0} AND data <= #{1:d}#", contractID, asOf); // létrehozzuk a feltételeket tartalmazó string-et
            
            DataRow[] rows = table.Select(filter); // a filter alapján lekérjük a sorokat
            Decimal result = 0m; 
            foreach (DataRow row in rows) { 
                result += (Decimal)row["amount"];  // majd összeadogatjuk azt
            } 
            return result;  // és visszatérünk vele
        }

    }

// a működésre bírása a következőképp történhet:
 DataSet mock = new DataSet(); // itt cska egy üres DataSet-et példányosítunk, ez az, amit a DataSource layerből kell kapnunk.
 Contract cr = new Contract(mock);
 cr.CalculateRecognitions(36); // legenerálja az RR mezőit a 36-os ID-jú szerződéshez
 RevenueRecognition rr = new RevenueRecognition(mock);
 Decimal amount = rr.RecognizedRevenue(36, DateTime.Now); // lekérjük a 36-os ID-jú szerződésből származó bevételeket a mai napig tartó időperiódusban

```

\[/tab\]\[/tabs\]

A fenti példán ha végigmegyünk, akkor láthatjuk, hogy bizony itt is piszkálják egymást a táblák és osztoznak a DataSet-en, amit kezdetben megkaptak. A Product osztály kapott egy speciális gettert, ami által a Contract le tudja kérni, hogy milyen típushoz is tartozik, ezáltal tudja, hogy milyen metodika alapján generálja le a bevételi kimutatásokat. Ha legeneráltuk a bevételi kimutatásokat, az adott contractID-hoz valót már könnyedén le is tudjuk kérni. Jól látható, hogy végig egy DataSet-el operálunk, amit a kezdeti DI-nél le lehet cserélni valami Mock adatokkal feltöltöttre és így tesztelhető is a rendszer.

Ha akarjuk, a fenti példa helyett használhatunk egy Table Data Gateway-t és annak irányíthatjuk a lekéréseinket. Ezzel a módszerrel megvalósítható PHP-ban is a dolog.

Viszont már megint kiderült, hogy a Service Layer nem fér bele az időkeretbe. Viszont az már a Data Source-hoz nem szükséges, ami következő témánk lesz!

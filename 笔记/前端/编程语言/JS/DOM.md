# 概述【定义，功能，意义】
[DOM 概述 - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model/Introduction?spm=a21iq3.home.0.0.54b42764PcwehE) 
定义：DOM是 [[HTML]] 与 [[XML]] 文档的**编程模型**。提供了对文档的**结构化表示**，并定义了一种方式，从程序中对该结构进行**访问**。
	1. 即，DOM是一种表示方法，提供了对该表示的访问方法。
功能
	1. 表示由多层节点构成的文档，通过它开发者可以添加、删除和修改页面的各个部分
	3. DOM Level 1：提供了基本*文档结构化表示*和*查询*的接口
意义
	1. DOM现在是真正*跨平台*、*语言无关*的**表示和操作网页的方式** 
	2. 之所以介绍DOM，是因为它与浏览器中的HTML文档有关，并在JS中提供了DOM API
特性
	1. 树形结构
## 内容
要理解DOM，最关键的一点是知道影响其**性能**的问题所在。
	1. *DOM操作*在JavaScript代码中是*代价*比较高的，NodeList对象尤其需要注意
		1. NodeList 对象**实时更新**，这意味着每次访问它都会执行一次新的查询。缓存查询
# 节点层级【节点，文档，文档类型，文档碎片，元素，属性，文本，注释，CDATA类型】
背景：DOM可以将HTML或XML文档*表示*为一个由**节点**组成的**层级结构**[^3] 
	1. 节点**类型** 
		1. *表示*文档中不同的信息或标记
		2. *拥有*自己不同的特性、数据和方法
		3. 与其他类型存在某种*关系* 
			1. 这些不同类型之间形成的关系构成了*层级*，让**标记表示为一个以特定节点为根的树形结构**。
	2. DOM中有12种节点类型
		1. 都继承自一种基础类型
## 实例
```html
<html>
  <head>
    <title>Sample Page</title>
  </head>
  <body>
    <p>Hello World!</p>
  </body>
</html>
```
用 DOM 表示为一个由节点组成的层级结构，则为 ![[Pasted image 20230709233103.png]]
> 文档根节点>子节点（文档元素）
> document节点>在html中是html元素，在xml中不定

1. **文档根节点**：使用document节点表示
2. 根节点的*唯一*子节点，我们称之为*文档元素*或*根元素*：documentElement。
	1. 层级：文档最外层的元素，所有其他元素都存在于这个元素之内
	2. 数量：每个文档只能有一个
	3. 实现
		1. HTML页面中，文档元素始终是html元素。
		2. XML文档中，则没有这样预定义的元素，任何元素都可能成为文档元素
HTML中的每段标记都可以表示为这个树形结构中的一个节点。
	HTML元素表示为元素节点
	属性表示为属性节点
## Node类型
背景：DOM Level 1描述了名为`Node`的接口
	1. 必要
		1. 所有 DOM 节点类型都必须实现，都*继承*自Node 类型，因此所有类型共享的属性和方法
	2. 访问：在JavaScript中被实现为 `Node类型`，在除IE之外的所有浏览器中都可以**直接访问**这个类型
分类：文档、元素、属性、文本、2 C、2 D
### 节点类型
每个节点都有`nodeType`属性，表示该节点的**节点类型** 。由定义在Node类型上的12个数值常量表示
- Node.ELEMENT_NODE（1）
- Node.ATTRIBUTE_NODE（2）
- Node.TEXT_NODE（3）
- Node.CDATA_SECTION_NODE（4）
- Node.ENTITY_REFERENCE_NODE（5）
- Node.ENTITY_NODE（6）
- Node.PROCESSING_INSTRUCTION_NODE（7）
- Node.COMMENT_NODE（8）
- Node.DOCUMENT_NODE（9）
- Node.DOCUMENT_TYPE_NODE（10）
- Node.DOCUMENT_FRAGMENT_NODE（11）
- Node.NOTATION_NODE（12）
通过与这些常量比较来**确定节点类型** 
```js
if (someNode.nodeType == Node.ELEMENT_NODE){
  alert("Node is an element.");
}
```
浏览器并不支持所有节点类型。开发者最常用到的是元素节点和文本节点。
节点层级：继承关系![[Pasted image 20230731163127.png]] 
### 节点信息
nodeName与nodeValue：值完全取决于节点类型。使用之前先检测类型
	1. 元素：nodeName是标签名，nodeValue是null
### 节点关系
文档中的所有节点都与其他节点有关系
每个节点都有【8个】
	1. `ownerDocument` ：文档节点。所有节点都被创建它们的文档所拥有
	2. `parentNode` ： 其DOM树中的父元素
	5. `previousSibling`和`nextSibling`可以在这个列表的节点间*导航*
		1. 列表中第一个节点的 previousSibling 属性、最后一个节点的 nextSibling 属性是null
		2. 只有一个节点，则它的previousSibling和nextSibling属性都是null
	3. `hasChildNodes()`：是在存在子节点
	4. `childNodes` 属性，其中包含一个 [[NodeList]] 的实例。列表中的每个节点都是同一列表中其他节点的同胞节点
	6. `firstChild`、`lastChild`。
		1. 只有一个子节点：指向该子节点
		2. 没有子节点：指向null
		3. 等同：`someNode.childNodes[0]`
### 节点操作
背景：所有关系指针都是**只读**的，所以DOM又提供了一些操纵节点的方法
1. 增加
	1.  `appendChild()` ：在 childNodes 列表**末尾添加**节点
		1. 返回新添加的节点
		2. 文档中*已存在节点*传给appendChild()，则这个节点会从之前的位置被转移到新位置
	2. `insertBefore(要插入的节点，参照节点)` ：在 childNodes 列表**特定位置添加**节点
		1. 如果参照节点是null，则insertBefore()与appendChild()效果相同
2. 替换： `replaceChild(要插入的节点，要替换的节点)` 
3. 移除： `removeChild()` 。返回被移除的节点
4. 每个节点的公共方法
	1. `cloneNode(Boolean)`：是否深复制某个节点
		1. 返回的节点归文档所有，是孤儿节点，没有父节点
		2. 只复制HTML属性，不复制JS属性。如事件处理程序
		3. true：复制节点及整个子 DOM 树
		4. false：只复制调用该方法的节点，忽略内容。复制返回的节点属于文档所有，但尚未指定父节点，所以可称为孤儿节点（orphan）
	2. `normalize()`：处理文档子树中的文本节点。
		1. 背景：由于解析器实现的差异或DOM操作等原因，可能会出现并不包含文本的文本节点，或者文本节点之间互为同胞关系。
		2. 节点上调用normalize()方法会*检测这个节点的所有后代*，从中搜索上述两种情形
			1. 出现并不包含文本的文本节点。发现*空文本节点*，则将其删除
			2. *文本节点之间*互为同胞关系。两个同胞节点是相邻的，则将其合并为一个文本节点
## Document类型
意义
	1. 是JavaScript中**表示文档节点**的类型。
	2. 浏览器中，文档对象document是HTMLDocument的实例（HTMLDocument继承Document），表示整个HTML页面。
	3. document是window对象的属性，因此是一个全局对象。
功能
	1. Document类型可以表示HTML页面或其他XML文档，但最常用的还是通过 `HTMLDocument的实例` 取得document对象。
	2. document对象可用于获取关于页面的信息以及操纵其外观和底层结构。
		1. 作为HTMLDocument的实例，document对象还有一个body属性，*直接指向*\<body>元素
特征
	1. nodeType等于9；
	2. nodeName值为" document "；
	3. nodeValue值为null；
	4. parentNode值为null；
	5. ownerDocument值为null；
应用
	1. 表示 HTML 页面或其他 XML 文档，
	2. 最常用的还是通过 HTMLDocument 的实例取得 document 对象。[[document]] 对象可用于获取关于页面的信息以及操纵其*外观和底层结构*。
### 文档子节点
DOM 规范规定 `Document节点的子节点` 可以是 DocumentType（最多一个）、Element（最多一个）、ProcessingInstruction 或 Comment，但也提供了两个**访问子节点的快捷方式**
	1. documentElement 属性：始终指向 HTML 页面中的 `<html>`元素
		1. document.childNodes中始终有`<html>`元素，但使用documentElement属性可以更快更直接地访问该元素
	2. DocumentType：另一种可能的子节点。
		1. <!doctype>标签是文档中独立的部分，其信息可以通过doctype属性（在浏览器中是document.doctype）来访问
		2. 只读
### 文档信息
document作为[[HTMLDocument]]的实例，还有一些标准Document对象上所没有的属性（提供浏览器所加载网页的信息）
	1. title属性：包含\<title>元素中的文本。用于读写页面的标题
	2. [[URL]]：当前页面的完整URL（地址栏中的URL）
	3. domain：页面的域名。可写，但不能设置为当前URL中不包含的值
	4. referrer：链接到当前页面的那个页面的URL。如果没有来源就是空字符串
### 获取元素
Document类型提供的两个方法，获取某个或某组元素的引用
1. getElementById()
	1. 不匹配则返回null
	2. 多个则返回第一个
2. getElementsByTagName()
	1. 返回包含零个或多个元素的`NodeList`
	2. HTML文档中，取得页面中所有的\<img>元素并返回包含它们的 [[HTMLCollection]] 对象
	3. 取得文档中的所有元素：getElementsByTagName()传入'\*'
	4. HTML页面，实际上是不区分大小写。XML页面（如XHTML）中使用，区分大小写
3. getElementsByName()
	1. 返回具有给定*name属性*的所有元素
	2. 最常用于单选按钮。因为同一字段的单选按钮必须具有相同的name属性才能确保把正确的值发送给服务器
		1. 多个type=radio，name属性必须相同。
### 元素集合
document对象上还暴露了几个特殊集合，这些集合也都是[[HTMLCollection]]的实例。
访问文档中公共部分
	1. document.anchors：包含文档中所有带name属性的\<a>元素
	2. document.links包含文档中所有带href属性的\<a>元素
	3. document.images包含文档中所有\<img>元素（与document.getElementsByTagName ("img")返回的结果相同）
	4. document.forms包含文档中所有\<form>元素（与document.getElementsByTagName ("form")返回的结果相同）
### DOM兼容性检测
背景：*DOM有多个Level和多个部分*，因此确定浏览器实现了DOM的哪些部分是很必要的。
方法
	1. document.implementation 属性是一个对象，其中提供了与*浏览器 DOM 实现*相关的信息和能力。**已经被废弃，不再建议使用** 
		1. DOM Level 1在document.implementation上只定义了一个方法`hasFeature(特性名称，DOM版本)`。
			1. 如果浏览器支持指定的特性和版本，则hasFeature()方法返回true
			2. `let hasXmlDom = document.implementation.hasFeature("XML", "1.0");` 
		2. 
### 文档写入
document对象有一个古老的能力，即*向网页输出流中写入内容*
对应方法
1. write()、writeln()、open()和close()。
	1. write()和writeln()方法都接收一个字符串参数，可以将这个字符串写入网页中。
		1. 功能
			1. write()简单地写入文本
			2. writeln()还会在字符串末尾追加一个换行符（\n）
		2. 特性
			1. 经常用于动态包含外部资源，如JavaScript文件
			2. 可以用来在*页面加载期间向页面中动态添加内容* 
2. open()和close()方法分别用于打开和关闭网页输出流。
## Element类型
背景：除了Document类型，Web开发中最常用的类型。
功能：表示**XML或HTML元素**，对外*暴露*出访问元素标签名、子节点和属性的能力
特征
	1. nodeType等于1；
	2. nodeName值为元素的标签名；
	3. nodeValue值为null；
	4. parentNode值为Document或Element对象；
	5. 子节点可以是Element、Text、Comment、ProcessingInstruction、CDATASection、EntityReference类型。
属性
	1. 可以通过`nodeName`或`tagName`属性来获取元素的标签名
		1. 在HTML中，元素标签名始终以全大写表示；在XML（包括XHTML）中，标签名始终与源代码中的大小写一致。
			1. div.tagName实际上返回的是"DIV"而不是"div"。使用toLowerCase处理再比较\=='div'
			2. 
### HTML元素
1. 所有*HTML元素*都通过HTMLElement类型表示，包括其直接实例和间接实例。【所有HTML元素都是HTMLElement或其子类型的实例】
2. HTMLElement直接继承Element并增加了一些属性。【可读写，获取、修改相应属性值】
	1. id，元素在文档中的唯一标识符；
	2. title，包含元素的额外信息，通常以提示条形式展示；
	3. lang，元素内容的语言代码（很少用）；
	4. dir，语言的*书写方向*（"ltr"表示从左到右，"rtl"表示从右到左，同样很少用）；
	5. className，相当于class属性，用于指定元素的CSS类（因为class是ECMAScript关键字，所以不能直接用这个名字）。
3. 并非所有这些属性的修改都会对页面产生影响
	1. id或lang改成其他值对用户是不可见的（假设没有基于这两个属性应用CSS样式）
	2. 修改title属性则只会在鼠标移到这个元素上时才会反映出来
	3. 修改dir会导致页面文本立即向左或向右对齐
	4. 修改className会立即反映应用到新类名的CSS样式（如果定义了不同的样式）
#### 所有 HTML 元素及其对应的类型

| 元素 | 类型 | 元素 | 类型 |
| ---- | ---- | ---- | ---- |
| A |	HTMLAnchorElement |	COL |	HTMLTableColElement |
| ABBR |	HTMLElement |	COLGROUP |	HTMLTableColElement |
| ACRONYM |	HTMLElement |	DD |	HTMLElement |
| ADDRESS |	HTMLElement |	DEL |	HTMLModElement |
| APPLET |	HTMLAppletElement |	DFN |	HTMLElement |
| AREA |	HTMLAreaElement |	DIR |	HTMLDirectoryElement |
| B |	HTMLElement |	DIV |	HTMLDivElement |
| BASE |	HTMLBaseElement |	DL |	HTMLDListElement |
| BASEFONT |	HTMLBaseFontElement |	DT |	HTMLElement |
| BDO |	HTMLElement |	EM |	HTMLElement |
| BIG |	HTMLElement |	FIELDSET |	HTMLFieldSetElement |
| BLOCKQUOTE |	HTMLQuoteElement |	FONT |	HTMLFontElement |
| BODY |	HTMLBodyElement |	FORM |	HTMLFormElement |
| BR |	HTMLBRElement |	FRAME |	HTMLFrameElement |
| BUTTON |	HTMLButtonElement |	FRAMESET |	HTMLFrameSetElement |
| CAPTION |	HTMLTableCaptionElement |	H1 |	HTMLHeadingElement |
| CENTER |	HTMLElement |	H2 |	HTMLHeadingElement |
| CITE |	HTMLElement |	H3 |	HTMLHeadingElement |
| CODE |	HTMLElement |	H4 |	HTMLHeadingElement |
| H5 |	HTMLHeadingElement |	PRE |	HTMLPreElement |
| H6 |	HTMLHeadingElement |	Q |	HTMLQuoteElement |
| HEAD |	HTMLHeadElement |	S |	HTMLElement |
| HR |	HTMLHRElement |	SAMP |	HTMLElement |
| HTML |	HTMLHtmlElement |	SCRIPT|	HTMLScriptElement |
| I |	HTMLElement |	SELECT|	HTMLSelectElement |
| IFRAME |	HTMLIFrameElement |	SMALL|	HTMLElement |
| IMG |	HTMLImageElement |	SPAN|	HTMLElement |
| INPUT |	HTMLInputElement |	STRIKE|	HTMLElement |
| INS |	HTMLModElement |	STRONG|	HTMLElement |
| ISINDEX |	HTMLIsIndexElement |	STYLE|	HTMLStyleElement |
| KBD |	HTMLElement |	SUB|	HTMLElement |
| LABEL |	HTMLLabelElement |	SUP|	HTMLElement |
| LEGEND |	HTMLLegendElement |	TABLE|	HTMLTableElement |
| LI |	HTMLLIElement |	TBODY|	HTMLTableSectionElement |
| LINK |	HTMLLinkElement |	TD|	HTMLTableCellElement |
| MAP |	HTMLMapElement |	TEXTAREA|	HTMLTextAreaElement |
| MENU |	HTMLMenuElement |	TFOOT|	HTMLTableSectionElement |
| META |	HTMLMetaElement |	TH|	HTMLTableCellElement |
| NOFRAMES |	HTMLElement |	THEAD|	HTMLTableSectionElement |
| NOSCRIPT |	HTMLElement |	TITLE|	HTMLTitleElement |
| OBJECT |	HTMLObjectElement |	TR|	HTMLTableRowElement |
| OL |	HTMLOListElement |	TT|	HTMLElement |
| OPTGROUP |	HTMLOptGroupElement |	U|	HTMLElement |
| OPTION |	HTMLOptionElement |	UL|	HTMLUListElement |
| P |	HTMLParagraphElement |	VAR|	HTMLElement |
| PARAM|	HTMLParamElement		| | |
### 取得属性
含义：每个元素都有零个或多个属性，通常用于*为元素或其内容附加信息*。
方式
	1. 属性相关的DOM方法主要有3个。这些方法主要用于*操纵属性*，包括在HTMLElement类型上定义的属性
		1. getAttribute()：通过DOM方法获取属性
			1. 给定的属性不存在，则getAttribute()返回null
			2. 也能取得不是HTML语言正式属性的自定义属性的值
		2. setAttribute()
		3. removeAttribute()
	2. 属性也可以通过*DOM元素对象的属性*来取得。包括HTMLElement上定义的直接映射对应属性的5个属性，还有所有公认（非自定义）的属性也会被添加为DOM对象的属性【自定义属性，因此不会成为DOM对象的属性】
		1. 有两个返回的值跟使用getAttribute()取得的值不一样
			1. style属性。
				1. 使用getAttribute()访问时，返回的是CSS字符串。
				2. 通过DOM对象属性访问时，返回的是一个（CSSStyleDeclaration）对象
			2. 事件处理程序（或者事件属性）
				1. 在元素上使用事件属性时（比如onclick），属性的值是一段*JavaScript代码*。
				2. 使用getAttribute()访问事件属性，则返回的是*字符串形式的源代码*。而通过DOM对象的属性访问事件属性时返回的则是一个JavaScript函数（未指定该属性则返回null）。这是因为onclick及其他事件属性是可以接受函数作为值的。
考虑到以上差异，开发者在进行DOM编程时通常会放弃使用getAttribute()而只使用对象属性。getAttribute()主要用于取得自定义属性的值
### 设置属性
setAttribute(要设置的属性名，属性的值)
	1. 如果属性已经存在，则setAttribute()会以指定的值*替换*原来的值；
	2. 如果属性不存在，则setAttribute()会以指定的值*创建*该属性
范围
	1. 适用于*HTML属性*，也适用于*自定义属性* 
特点
	1. 使用setAttribute()方法设置的属性名会规范为小写形式，因此"ID"会变成"id"
	2. *元素属性也是DOM对象属性*，
		1. 直接给*DOM对象的属性*赋值也可以设置*元素属性*的值
		2. 在DOM对象上添加*自定义属性*，不会自动让它变成元素的属性

removeAttribute()用于从元素中删除属性。不单是清除属性值，而是会把整个属性完全从元素中去掉
	1. 用得并不多，但在*序列化DOM*元素时可以通过它控制要包含的属性
### attributes 属性
意义：Element类型是唯一使用attributes属性的DOM节点类型
特点
	1. 包含一个**NamedNodeMap**实例，是一个类似NodeList的“实时”集合。元素的每个属性都表示为一个*Attr节点*，并保存在这个*NamedNodeMap对象*中
		1. `getNamedItem(name)`，返回nodeName属性等于name的节点；
			1. `let id = element.attributes.getNamedItem("id").nodeValue`：获取id属性的值
		2. `removeNamedItem(name)`，删除nodeName属性等于name的节点；
			1. 与元素上的removeAttribute()方法类似，也是删除指定名字的属性
			2. 返回：被删除属性的Attr节点
		3. `setNamedItem(node)`，向列表中添加node节点，以其nodeName为索引；
		4. `item(pos)`，返回索引位置pos处的节点。
	2. attributes属性中的每个节点的`nodeName`是对应属性的名字，`nodeValue`是属性的值
		1. 也可以用这种语法设置属性的值，即先取得属性节点，再将其nodeValue设置为新值，如下所示`element.attributes["id"].nodeValue = "someOtherId";`
一般来说，因为使用起来更简便，通常*设置属性时*，开发者更喜欢使用getAttribute()、removeAttribute()和setAttribute()方法，而不是刚刚介绍的NamedNodeMap对象的方法。
场景
	1. 需要迭代元素上所有属性的时候
### 创建元素
document.createElement(要创建元素的标签名)
	1. 在HTML文档中，标签名是不区分大小写的，而XML文档（包括XHTML）是区分大小写的
	2. 创建新元素的同时也会将其ownerDocument属性设置为document

#### 元素添加到文档树
可以使用appendChild()、insertBefore()或replaceChild()
	1. 元素被添加到文档树之后，浏览器会立即将其渲染出来
### 元素后代
元素可以拥有任意多个子元素和后代元素，因为元素本身也可以是其他元素的子元素
1. 元素所有的子节点：`childNodes`属性，这些子节点可能是其他元素、文本节点、注释或处理指令
	1. 不同浏览器在识别这些节点时的表现有明显不同
		1. 3个li子元素的ul元素会包含7个子元素。因为一个代表li元素周围的空格
		2. 如果把元素之间的空格删掉，所有浏览器都会返回同样数量的子节点
		3. 通常在执行某个操作之后需要先检测一下节点的nodeType。只当nodeType\=\==1时才执行。
2. 元素的元素子节点： `children` 属性
3. 某个元素的子节点和其他后代节点：`getElementsByTagName()`方法
## Attr类型
**元素数据**在DOM中通过Attr类型表示
Attr 类型构造函数和原型在所有浏览器中都可以直接访问。技术上讲，*属性是存在于元素 attributes 属性中的节点* 
特征
	1. nodeType等于2；
	2. nodeName值为属性名；
	3. nodeValue值为属性值；
	4. parentNode值为null；
	5. 在HTML中不支持子节点；
	6. 在XML中子节点可以是Text或EntityReference。

1. 属性节点尽管是节点，却*不被认为是DOM文档树的一部分*。
	1. Attr节点很少直接被引用，通常开发者更喜欢使用getAttribute ()、removeAttribute ()和setAttribute ()方法**操作属性**。
2. Attr对象上有3个*属性*
	1. name。属性名（与nodeName一样）
	2. value。属性值（与nodeValue一样）
	3. specified。布尔值，表示属性使用的是默认值还是被指定的值
3. 创建该*类型节点*
	1. `document.createAttribute(属性名)` 
4. 添加到元素
	1. `element.setAttributeNode(attr);` 
5. 访问
	1. `attributes`属性
	2. `getAttributeNode()` 
	3. `getAttribute()`：访问*属性节点*和访问*属性*有什么区别？
## Text类型
Text 类型节点表示，包含*按字面解释的纯文本*，也可能包含*转义后的 HTML 字符*，但不含 HTML 代码。
特征
	1. nodeType等于3；
	2. nodeName值为"text"；
	3. nodeValue值为节点中包含的文本；
	4. parentNode值为Element对象；
	5. 不支持子节点。
包含文本：可以通过nodeValue属性访问，也可以通过data属性访问，这两个属性包含相同的值。修改nodeValue或data的值，也会在另一个属性反映出来
操作文本
	1. appendData(text)，向节点末尾添加文本text；
	2. deleteData(offset, count)，从位置offset开始删除count个字符；
	3. insertData(offset, text)，在位置offset插入text；
	4. replaceData(offset, count, text)，用text替换从位置offset到offset + count的文本；
	5. splitText(offset)，在位置offset将当前文本节点拆分为两个文本节点；
	6. substringData(offset, count)，提取从位置offset到offset + count的文本。
	7. length属性获取*文本节点中包含的字符数量* 。这个值等于nodeValue.length和data.length。
### 创建
document.createTextNode(要插入节点的文本)
	1. 跟设置已有文本节点的值一样，这些要插入的文本也会应用HTML或XML编码
	2. 创建新文本节点后，其ownerDocument属性会被设置为document。
### 规范化
合并相邻的文本节点。这个方法叫normalize()
在包含两个或多个相邻文本节点的父节点上调用normalize()时，所有同胞文本节点会被合并为一个文本节点，这个文本节点的nodeValue就等于之前所有同胞节点nodeValue拼接在一起得到的字符串。
### 拆分
Text类型定义了一个与normalize()相反的方法——splitText()：在指定的偏移位置拆分nodeValue，将一个文本节点拆分成两个文本节点
	1. 拆分之后，原来的文本节点包含开头到偏移位置前的文本，新文本节点包含剩下的文本
## Comment类型

## CDATASection类型

## DocumentType类型

## DocumentFragment类型

# DOM编程【脚本，样式，表格，List】
操作DOM
	1. 很多时候，操作DOM是很*直观*的。通过HTML代码能实现的，也一样能通过JavaScript实现。
	2. 但有时候，DOM也*没有看起来那么简单*。浏览器能力的参差不齐和各种问题，也会导致DOM的某些方面会复杂一些。
## 动态脚本
定义：在*页面初始加载*时不存在，之后又*通过DOM包含*的脚本
方式：与对应的HTML元素一样，有两种方式通过\<script>动态为网页添加脚本：
### 引入外部文件
```js
function loadScript(url) {
  let script = document.createElement("script");
  script.src = url;
  document.body.appendChild(script);
}
// 然后，就可以像下面这样加载外部JavaScript文件了
loadScript("client.js");
```
怎么能知道脚本什么时候加载完？这个问题并没有标准答案。参考与加载相关的[[DOM事件]]。
### 直接插入源代码
直接写入script标签
```js
<script>
  function sayHi() {
    alert("hi");
  }
</script>
```
或使用DOM
```js
// 可以在Firefox、Safari、Chrome和Opera中运行。不过在旧版本的IE中可能会导致问题.
// IE对<script>元素做了特殊处理，不允许常规DOM访问其子节点
let script = document.createElement("script");
script.appendChild(document.createTextNode("function sayHi(){alert('hi');}"));
document.body.appendChild(script);

// 不支持Safari 3之前的版本
var script = document.createElement("script");
script.text = "function sayHi(){alert('hi');}";
document.body.appendChild(script);

// 如果不要支持safari 3之前的版本
var script = document.createElement("script");
var code = "function sayHi(){alert('hi');}";
try {
  script.appendChild(document.createTextNode("code"));
} catch (ex){
  script.text = "code";
}
document.body.appendChild(script);
```
最终版本
```js
// 抽象出一个跨浏览器的函数
function loadScriptString(code){
  var script = document.createElement("script");
  script.type = "text/javascript";
  try {
    script.appendChild(document.createTextNode(code));
  } catch (ex){
    script.text = code;
  }
  document.body.appendChild(script);
}
// 调用
loadScriptString("function sayHi(){alert('hi');}");
这种方式加载的代码会在全局作用域中执行，并在调用返回后立即生效
```
注意
	1. 使用innerHTML创建的\<script>元素，以后也没有办法强制其执行
## 动态样式
定义：动态样式也是页面初始加载时并不存在，而是在之后才添加到页面中的
CSS样式在HTML页面中可以通过两个元素加载

通过外部文件加载样式是一个异步过程
	1. 样式的加载和正执行的JavaScript代码并没有先后顺序
	2. 也没有必要知道样式什么时候*加载完成* 
### link元素用于包含CSS外部文件
```js
function loadStyles(url){
  let link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = url;
  let head = document.getElementsByTagName("head")[0];
  head.appendChild(link);
}

loadStyles("styles.css");
```
### style元素用于添加嵌入样式
IE对\<style>节点会施加限制，不允许访问其子节点，这一点与它对\<script>元素施加的限制一样
通用
```js
function loadStyleString(css){
  let style = document.createElement("style");
  style.type = "text/css";
  try{
    style.appendChild(document.createTextNode(css));
  } catch (ex){
    style.styleSheet.cssText = css;
  }
  let head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
}

loadStyleString("body{background-color:red}");
```

注意
	1. 对于IE，要小心使用styleSheet.cssText。如果重用同一个\<style>元素并设置该属性超过一次，则可能导致浏览器崩溃。同样，将cssText设置为空字符串也可能导致浏览器崩溃。
## 操作表格
HTML中最复杂的结构之一.通过DOM编程创建\<table>元素，通常要涉及大量标签，包括表行、表元、表题，等等。
	1. 通过DOM编程创建和修改表格时可能要写很多代码
使用这些属性和方法*创建表格*让代码变得更有逻辑性，也更容易理解
## 使用NodeList
理解[[NodeList]]对象和相关的 `NamedNodeMap` 、[[HTMLCollection]] ，是理解 DOM 编程的关键。
这三个集合的特性
	1. 都是“实时的”。文档结构的变化会实时地在它们身上反映出来，因此它们的值始终代表最新的状态
	2. 任何时候要*迭代NodeList*，最好再初始化一个变量保存当时查询时的长度，然后用循环变量与这个变量进行比较

最好限制操作NodeList的次数。因为每次查询都会**搜索整个文档**，所以最好把查询到的NodeList缓存起来
# [[MutationObserver]]接口
背景：为代替性能不好的*MutationEvent*而问世，
功能：可以有效精准地**监控DOM变化**，而且API也相对简单

## 基本用法
observe ()方法
回调与MutationRecord
disconnect ()方法
复用MutationObserver
重用MutationObserver
## MutationObserverInit与观察范围
观察属性
观察字符数据
观察子节点
观察子树
## 异步回调与记录队列
记录队列
takeRecords ()方法
## 性能、内存与垃圾回收
[[MutationObserver]]的引用 
MutationRecord的引用
# 基本概念
节点
# 属性
1. screen.height：*显示器高度*
2. window.outerHeight：浏览器*软件高度*【全屏时等于显示器高度】
3. 浏览器*视口高度* 
	1. window.innerHeight
	2. document.documentElement.clientWidth：页面的宽高
4. **client**Width：*content+padding*。不含滚动部分
	1. clientLeft：左border宽度
	2. document.documentElement.clientWidth：页面的宽高
	3. document.body.clientHeight：body高度
5. **scroll**Width、scrollY：*content+padding*。含滚动部分。
	1. 特点
		1. 没有滚动：等于 clientHeight
		2. 有滚动：==滚动内容高度== + ==padding== 
		3. 如果设置 scroll 为 auto，content 高为手动设置的高度
		4. 如果设置 scroll 为 scroll，content 高缩小
	2. scrollLeft：左侧滚动的距离
	3. window.scrollY === window.pageYoffset：文档相对视口的滚动距离
6. **offset**Width：*content+padding+border*。含滚动条
	1. offsetTop：元素*上边框*与 offsetParent 元素的上边框距离
	2. offsetParent：元素距离<u>定位父元素</u>的*顶部偏移量*，如果一直没有最多上升到 body 元素。
		1. 元素自身有 fixed 定位，则为 Null
		2. 无 fixed，且上级无定位：body 元素
		3. 无 fixed，上级有定位：存在定位的上级元素
		4. body 元素：null
7. 元素自身有fixed定位，则
	1. scrollY：被滚动的高度
	2. scrollTop：一个内部产生了滚动，它的内容区被滚动的值
		1. 可写：开发者修改卷去的长度。回到页面某个位置
	3. 兼容
		1. 非safari浏览器可使用document.documentElement.scrollTop读取页面滚动的距离
		2. safari需要用document.body.scrollTop
		3. 兼容代码：var docScroll = document.documentElement.scrollTop || document.body.scrollTop。实现常用的“回到顶部”功能
8. 鼠标
	1. event.offsetX：鼠标相对于事件*触发元素*的 X,Y 坐标
	2. event.clientX：鼠标相对于浏览器*可视区*的坐标
	3. event.pageX：鼠标相对于*文档*的坐标
	4. event.screenX：鼠标相对于*显示器*的坐标


## 比较
clientWidth：2个
offsetWidth：3个
# 方法
window.scrollTo(x, y)：文档左上角滚动到某个点
当前元素在<u>页面</u>上的偏移量
## 元素节点
### 操作【获取，创建，插入，替换，删除】
1. 获取
	1. id
	2. name：伪数组，name 属性
	3. tagName：伪数组，标签名
	4. className：伪数组，class 属性性
	5. querySelector()
	6. querySelectorAll(标签名)
	7. matches()
2. 创建
	1. createElement
	2. createDocumentFragment
3. 插入：
	1. appendChild
	2. insertBefore
4. 替换：replaceChild
5. 删除：removeChild
6. 移动：先获取，再插入【插入的是已有节点时，执行的操作不是复制，而是移动】
### 关系
1. 父元素：parentNode
2. 子元素列表：childNodes
	1. 含元素节点、文本节点
### 设置属性
两种方式
	都可能引起*DOM重新渲染*。尽量使用property。
1. property：修改的是JS获取到的元素的对象的属性，不会作用到标签
	p.style.width = '23px'
	p.className='red' // 因为class是关键字
	p.nodeName
	p.nodeType
1. attribute：修改HTML标签的属性，会作用到标签
	p.setAttribute('date-name', 'mooc')
# 性能
原因：DOM操作非常“昂贵”
方案
	1. 对DOM查询做缓存[^1] 
		1. 多次*获取*DOM
	2. 批处理：将频繁操作组合为一次操作
		1. 多次*插入*DOM。应：多次创建，通过`createDocumentFragment()`一次插入
# [[DOM扩展]] 
# [[DOM 2与DOM 3]] 

[^1]: 保存在变量里，不要每次用都获取一次DOM节点
[^3]: 一切都是节点
# git flow规范
阅读GIT文档
git flow采用了[[FDD]]，
分类
	1. 长期分支
		1. master/production-主分支
		2. development-开发主干分支
	2. 短期分支
		1. feature-功能分支
		2. hotfix-补丁分支
		3. release-预发分支

1. master：只能从其他分支合并，不能直接修改。合并到master的分支只能来自release或hotfix分支。
2. develop：*基于master的tag建立*，用于暂时保存开发完成尚未发布的feature分支内容、及其他短期分支内容
3. feature：一般一个新功能对应一个功能分支，与已完成的功能隔离开，只有在功能完成开发时所属的feature分支才能合并到主开发主分支。
4. release：需要发布时*基于develop 新建*，之后合并到测试环境，有问题直接在该分支修改。发布结束后会合并到develop与master，不会丢失代码。
5. hotfix：紧急修复一些bug，基于master的tag建立，修复结束后合并到develop与master。
# git commit 规范
[[commit message规范]] 
修改git commit 使用的插件：npm i -g cz-customizable，修改原有的cz-conventional-changelog插件为cz-customizable 
![[Pasted image 20220828182346.png]]
可使angular 规范展示中文message。
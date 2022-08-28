# git flow规范
git flow采用了[[FDD]]，
特点
	1. 存在长期分支
		1. master-主分支
		2. develop-开发主干分支
	2. 短期分支
		1. feature-功能分支
		2. hotfix-补丁分支
		3. release-预发分支

master：产品分支
	1. 只能从其他分支合并，不能直接修改。合并到master的分支只能来自release或hotfix分支。
develop：开发主干分支
	1. 基于master的tag建立，用于暂时保存开发完成尚未发布的feature分支内容、及其他短期分支内容
feature：一般一个新功能对应一个功能分支，
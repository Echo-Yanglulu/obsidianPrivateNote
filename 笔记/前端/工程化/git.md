git flow：git工作流，提升项目迭代效率
	1. 规范：[[git工程规范]] 
git commit：通过创建提交，提高review效率
git hook：提升协同代码质量
# 工作流
[[git flow]] 
创建git仓库：
1. 已有项目代码
	1. git init
2. 对新建项目
	1. git init 项目名

# 命令
代码所处位置：工作区，暂存区。
通过git status查看两个区的工作状态
命令行：. 代表当前目录
[[git命令]] 
1. git  \<command> -h 多查文档
2. git config
	1. --local 设置git 配置：仅对当前仓库/项目有效
	2. --global 对*当前用户*的所有仓库有效
		1. user.name
	3. --system 对使用当前系统的*所有用户*的仓库有效
	4. --list --local 查看local的git配置
	5. 同时设置了global与local时，当前仓库认为Local优先级最高
3. git status：对状态的跟踪
	1. 文件状态
		1. 未跟踪
		2. 已跟踪
	2. 内容状态
		1. 工作目录--暂存区
		2. 暂存区--提交
4. git add
	1. \. :添加【当前路径】文件到暂存区（还没有被commit：正式进入版本历史）、并跟踪文件
	2. filename 添加该文件
	3. portfolio
	4. 文件名 文件夹
	5. -u 把所有更新的文件提交到暂存区
5. git commit
	1. --amend 修改提交信息
	2. --amend -m '' 修改提交信息为
6. git checkout 
	1.  -b a b 基于分支/提交记录b创建分支a。
7. git rm   删除
8. git merge 合并
9. git rebase 变基
	1. -i  + [[hash值]] ，可合并该hash之后（**不含**）的提交。
10. gi reset
	1. 无命令：取消暂存
	2. --hard 不想要某个节点之后的记录。可回退到合并提交之前的状态。
11. git branch
	1. -d 分支名 删除分支。如果该分支有不需要但没有合并的代码，可用-D
12. git remote
	1. 无命令：查看连接的远程仓库
	2. -v  查看本地与远程的仓库
	3. add origin
		1. add github git@github.com:gitajodif/git_learning.git  添加某个常用仓库并命名
13. git list
14. git diff 比较两个提交的差异
	1. HEAD HEAD~2/HEAD^^
15. gitk 查看diff
	1. 每个终点，都代表当前仓库有至少一个分支
git status => gst
# git hook
git 仓库中特定事件触发后被调用的脚本。
# 常用操作
1. 文件重命名
	1. 修改mv readme readme.md。把修改后的文件添加到暂存区git add readme.md。移除原文件git rm readme
	2. git mv readme readme.md  修改暂存区中某个文件的文件名
2. 查看版本历史：git log 配置项configOption
	1. git log 没有任何参数：只有版本历史
	2. -n3 最近3次提交
	3. --oneline 每次每次仅使用一行展示
	4. --graph
	5. --all
3. 修改过往commit的提交信息：git rebase -i
4. 把连续多个commit合并为1个
	1. git rebase -i 最旧的commit hash值
5. 把非连续的多个commit合并为1个
6. diff当前HEAD与暂存区

# 最佳实践
1. commit offen, perfect later[^1].
	1. 用git rebase -i合并多次提交。通过最后的合并，隐藏香肠的丑陋制做过程。
2. 发现有代码不见了。
	1. 先确保保存当前进度
	2. git reflog。引用记录：记录所有可能导致引用变化的操作
	3. 通过rebase/reset/cherry-pick恢复
3. 慎用git push -f
4. 使用分支
	1. 单人一个分支
		1. 以生产新建分支，在此基础上每个feature建立一个分支。
	2. 多人一个分支
5. 随时更新远程分支
	1. 拉取：不要使用git pull[^2]，而是使用git pull --rabase[^3]。
	2. 合并：使用git merge --no-ff[^4]，可为当前分支创建简洁的提交记录，便于快速查看版本历史

[^1]: 用rebase -i
[^2]: git 图会生成很多开叉
[^3]: 适用于多个使用一个分支的情况：把没有push的提交作为最新提交，拉取的提交作为历史提交。
[^4]: fast-forward是git merge 的默认行为。即如果合并到master分支时master没有其他提交，则master会直接指向当前分支。导致master记录太多。相同情况使用no-ff则会为此次合并在master生成一个新的提交记录。便于单独查看master的提交记录。
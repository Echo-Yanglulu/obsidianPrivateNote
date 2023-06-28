# 概述
HEAD：指向当前分支上最新的提交记录
	通常指向分支名
HEAD~1：上一个提交

1. 分区
2. 提交记录
	1. 所有改动内容
	2. 有一个hash值，用于提交的标识符
3. 分支：一系列的提交，通常指向最新提交
	1. 修改分支指向
		1. git branch -f 分支名 提交名
		2. git reset HEAD^ 分支指向上一个提交
			1. 后续变更还在，但不在暂存区
4. HEAD：通常指向分支，偶尔直接指向提交，
	更灵活。指向分支则【只能指向提交树上的终点】
	分离HEAD：指向提交，而不是分支【可指向提交树的任意一点】
5. 查找提交
	1. 绝对引用：每次提交所特有的hash值
	2. 相对引用：相对地指向提交
		1. ^^^：向上三次；~3：向上3次
		2. git checkout main^：指向main最新提交的上次提交
# 工作流
[[git flow]] 
规范：[[git工程规范]] 
创建git仓库
1. 已有
	1. git init
2. 新建
	1. git init 项目名
# 命令
代码所处位置：工作区，暂存区。
通过git status查看两个区的工作状态
命令行：. 代表当前目录
[[git命令]] 
1. git  \<command> -h 多查文档
2. git config【同时设置时，local优先级最高】
	1. --local 设置git 配置：仅对*当前项目*有效
	2. --global 对*当前用户*的所有仓库有效
	3. --system 对使用当前系统的*所有用户*的仓库有效
	4. --list --local 查看local的git配置
3. git status：对状态的跟踪
	1. 文件状态
		1. 未跟踪
		2. 已跟踪
			1. 工作目录
			2. 暂存区
			3. 提交
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
	1. -i  + [[hash值]] ，可**合并**该hash之后（不含）的提交。
	2. 分支名
		1. 将当前分支与目标分支对比，找到公共的commit，将当前分支的该commit之后的**commit移动**到目标分支
		2. 此时目标分支仍指向旧有提交，需要更新使其指向最新节点。`git rebase bugFix`
10. gi reset
	1. 无命令：取消暂存
	2. --hard 不想要某个节点之后的记录。可回退到合并提交之前的状态。
11. git revert
12. git branch
	1. -d 分支名 删除分支。如果该分支有不需要但没有合并的代码，可用-D
13. git remote
	1. 无命令：查看连接的远程仓库
	2. -v  查看本地与远程的仓库
	3. add origin
		1. add github git@github.com:gitajodif/git_learning.git  添加某个常用仓库并命名
14. git list
15. git diff 比较两个提交的差异
	1. HEAD HEAD~2/HEAD^^
16. gitk 查看diff
	1. 每个终点，都代表当前仓库有至少一个分支
## 别名
系统中的.gitconfig文件
```js
[alias]
    co = checkout		//输入git co => git checkout
    st = status			//输入git st => git status
    cm = commit -m		//输入git cm => git commit -m
    br = branch			//输入git br => git branch 
    dif = diff			//输入git dif => git diff 
    pl = pull			//输入git pl => git pull
    ps = push			//输入git ps => git push
```
git status => gst
# git hook
git 仓库中特定事件触发后被调用的脚本。
	1. 提升协同代码质量

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
7. 在提交树上移动
	1. 已经作出一个提交，又做出一个提交。被告知上上个提交有问题。
		1. 问题提交移动到最前，修改完成后移动回去。
8. 复制提交树
	1. 把提交复制到当前提交后面 git cherry-pick C1 C2 C5：复制三次提交
		1. 不能是HEAD上游的提交
	2. git rebase -i HEAD~4 ：列出最近4个
		1. 调整顺序：以列表的上一个提交为起点，复制调整顺序后的4个提交![[Pasted image 20230628184345.png]]
		2. 删除[^5]，
		3. 合并
9. 本地栈式提交
10. 合并
	1. merge
	2. rebase
11. 回滚/撤销
	1. git reset 提交：让当前分支指向某个commit
		1. 之后的提交还在，但不在暂存区
	2. git revert 提交：生成一个*撤销一次提交*的新改动
		1. git revert HEAD：撤销此次提交
	3. 区别：revert可push

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
[^5]: 只pick想要的
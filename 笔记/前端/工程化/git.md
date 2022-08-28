git flow：git工作流，提升项目迭代效率
	1. 规范：[[git工程规范]] 
git commit：通过创建提交，提高review效率
git hook：提升协同代码质量

创建git仓库：
1. 已有项目代码
	1. git init
2. 对新建项目
	1. git init 项目名

代码所处位置：工作区，暂存区。
通过git status查看两个区的工作状态

命令行：. 代表当前目录

1. git config
	1. --local 设置git 配置：仅对当前仓库/项目有效
	2. --global 对当前用户的所有仓库有效
	3. --system 对所有用户的仓库有效
	4. --list --local 查看local的git配置
	5. 同时设置了global与local时，当前仓库认为Local优先级最高
2. git add
	1. . 添加【当前路径】文件到暂存区（还没有被commit：正式进入版本历史）
	2. 文件名 添加该文件
	3. 文件夹
	4. 文件名 文件夹
	5. -u 把所有更新的文件提交到暂存区
3. git commit
	1. --amend 修改提交信息
	2. --amend -m '' 修改提交信息为
4. git checkout 
	1.  -b a b 基于分支/提交记录b创建分支a。
5. git rm   删除
6. git merge 合并
7. git rebase 变基
	1. -i 
8. gi reset
9. git branch
	1. -d 分支名 删除分支。如果该分支有不需要但没有合并的代码，可用-D
10. git remote
	1. -v  查看本地与远程的仓库
	2. add github git@github.com:gitajodif/git_learning.git  添加某个常用仓库并命名
11. git list
12. git diff 比较两个提交的差异
	1. HEAD HEAD~2/HEAD^^
13. gitk 查看diff
	1. 每个终点，都代表当前仓库有至少一个分支
	
git status => gst
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
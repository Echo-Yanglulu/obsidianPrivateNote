![[Pasted image 20220717195156.png]] 
# 功能
1. 自动生成changelog
2. 根据commit message选择版本
3. 可手动发布pre-release版本
4. 发版后自动打[[git]] tag
	1. 以便回滚
# 配置
![[Pasted image 20220717195426.png]]
# 使用
## 自动化发版
根目录运行yarn release-it即可
如果git cm "feat: ignore update"，如果以feat开头，会认为是feature更新。
## changelog更新

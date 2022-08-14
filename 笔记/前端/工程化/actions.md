# github actions
## 原因
CI往往与代码的版本管理流程紧密结合，**CI的整个过程往往由GIT触发[^1]**。
为此，gitlab设计了gitlab CI，github设计了github actions。
## 特性
1. 大量的计算资源[^2]
2. 语言与框架的广泛支持
3. 实时日志，为构建提供丰富反馈
4. actions可自由创造与分享[^3]
# 基本概念
![[github actions.svg]]
workflow > job > step > action
workflow由一个或多个JOB[^4]构成，
job是一系列step，
每个step[^5]是多个action[^6]。
# 使用
## 起步
新建.github/workflows文件夹[^7]，每个[[yml文件]]，都是一个workflow。
	name字段：名称，没有则取文件名
	on：触发条件（定时，事件，手动）
	**job**：一个目的
		jobId
		name：名字
		runs-on：运行所需的**虚拟机环境**
		needs：当前job的**依赖项**
		**steps**：（一个job的）运行步骤
			1. name：一个step名字
			2. env：该步骤所需要的**环境变量**
			3. run：该step运行的命令
			4. uses：调用一个**外部的action**
			5. with：
		
## 示例
### 一个next.js应用的构建与部署
步骤：
	1. 切换到正确git分支
	2. 安装node**环境**
	3. 安装**依赖**，**构建**应用
	4. **部署**到AWS[^8]
![[Pasted image 20220814151535.png]]
在push时触发，触发分支是master（主要分支？）。只有一个build job，这个JOB依赖的虚拟机环境是最新的ubutu。主要有4个steps，

[^1]: 比如在push的时候，或merge一个MR时触发CI
[^2]: 为每个workflow（==一次CI**过程**==）提供一个独享的一核虚拟CPU，3.75GB的内存，网络权限，100GB的磁盘空间。所以actions的性能强大。
[^3]: CI流程中很多操作类似。就允许把每个操作可写成独立脚本，放在仓库。需要的可直接引用他人写好的，整个CI过程实质就成了actions组合过程。
[^4]: 完成某个==**目的**==的一系列步骤。如build，test与deploy，三个步骤可以是三个job。默认**并行**运行，除非指定依赖关系
[^5]: 组成job的步骤，可是自定义的**命令**，也可引入其他仓库的action。
[^6]: 对一种**逻辑**的封装，每个step可**依次**执行一个或多个action。
[^7]: 顾名思义，里面都是workflow。
[^8]: 亚马逊的微服务
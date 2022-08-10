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
workflow由一个或多个JOB[^4]构成，
workflow > job > step > action
[^1]: 比如在push的时候，或merge一个MR时触发CI
[^2]: 为每个workflow（一次CI过程）提供一个独享的一核虚拟CPU，3.75GB的内存，网络权限，100GB的磁盘空间。所以actions的性能强大。
[^3]: CI流程中很多操作类似。就允许把每个操作可写成独立脚本，放在仓库。需要的可直接引用他人写好的，整个CI过程实质就成了actions组合过程。
[^4]: 完成某个目的的一系列步骤。如build，test与deploy，三个步骤可以是三个job。默认并行运行，除非指定依赖关系
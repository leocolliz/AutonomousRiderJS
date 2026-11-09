import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
plt.rcParams["font.family"]="Liberation Sans"
W,H=17.0,12.7
fig=plt.figure(figsize=(W/2.54,H/2.54))
ax=fig.add_axes([0,0,1,1]); ax.set_xlim(0,W); ax.set_ylim(H,0); ax.axis("off")
FS=11
ST={"comm":("#E7E9EC","#6B7280","#1F2937"),"dir":("#1F3A5F","#1F3A5F","white"),
    "staff":("#DCE8F5","#3B6EA5","#1F2937"),"op":("#C9DCF0","#1F3A5F","#1F2937"),
    "bim":("#DDF1EE","#2A8C7E","#1F2937"),"sub":("#FFFFFF","#3B6EA5","#1F2937")}
def box(x,y,w,h,lines,st,cam=False,lh=0.46):
    fc,ec,tc=ST[st]
    ax.add_patch(FancyBboxPatch((x,y),w,h,boxstyle="round,pad=0,rounding_size=0.15",fc=fc,ec=ec,lw=1.2))
    n=len(lines); y0=y+h/2-(n-1)*lh/2
    for i,t in enumerate(lines):
        b = i==0
        ax.text(x+w/2,y0+i*lh,t,ha="center",va="center",fontsize=FS,color=tc,
                fontweight="bold" if b else "normal")
    if cam:
        bx,by=x+w-1.4,y-0.45
        ax.add_patch(FancyBboxPatch((bx,by),1.25,0.5,boxstyle="round,pad=0,rounding_size=0.1",fc="#2E8B3E",ec="white",lw=1))
        ax.text(bx+0.625,by+0.25,"CAM",ha="center",va="center",fontsize=11,color="white",fontweight="bold")
def line(xs,ys,dash=False,c="#1F3A5F"):
    ax.plot(xs,ys,color=c if not dash else "#6B7280",lw=1.3,ls=(0,(4,3)) if dash else "-",zorder=0)
# Row 1 committenza + BIM
r1y,r1h=0.25,1.6
cw=3.95; xs=[0,4.15,8.3]
labels=[["RUP","Committente"],["DIREZIONE","LAVORI"],["COORDINATORE","SICUREZZA (CSE)"]]
for x,l in zip(xs,labels): box(x,r1y,cw,r1h,l,"comm")
box(12.6,0.08,4.4,r1y+r1h-0.08,["BIM TEAM ESTERNO","BIM Manager","BIM Coordinator","BIM Specialist"],"bim",lh=0.42)
# Row 2 DTC
r2y,r2h=2.75,1.75; dx,dw=3.0,8.4
box(dx,r2y,dw,r2h,["DIRETTORE TECNICO DI CANTIERE","Tecnico competente in materia C.A.M."],"dir",cam=True)
for x in xs:
    cx=x+cw/2; cx2=min(max(cx,dx+0.6),dx+dw-0.6)
    line([cx,cx,cx2,cx2],[r1y+r1h,(r1y+r1h+r2y)/2,(r1y+r1h+r2y)/2,r2y],dash=True)
line([14.8,14.8,dx+dw],[r1y+r1h,r2y+r2h/2,r2y+r2h/2],dash=True)
# Row 3 staff
r3y,r3h=5.35,1.25; sw=4.0; g=(W-4*sw)/3
st=[["UFFICIO","ACQUISTI"],["CONTABILITÀ","LAVORI"],["RILIEVI E","TRACCIAMENTI"],["UFFICIO","AMMINISTRATIVO"]]
busy=5.0; mid=W/2
line([mid,mid],[r2y+r2h,busy])
line([sw/2,W-sw/2],[busy,busy])
for i,l in enumerate(st):
    x=i*(sw+g); line([x+sw/2,x+sw/2],[busy,r3y]); box(x,r3y,sw,r3h,l,"staff")
# Row 4: Capocantiere -> Preposto -> Caposquadra
r4y,r4h=7.3,1.25; bw4=4.6; gx=sw+g/2  # varco tra 1a e 2a casella staff
c1=gx-bw4/2; c2=c1+bw4+0.65; c3=W-bw4
line([gx,gx],[busy,r4y])
box(c1,r4y,bw4,r4h,["CAPOCANTIERE","formazione C.A.M."],"op",cam=True)
box(c2,r4y,bw4,r4h,["PREPOSTO","sicurezza – C.A.M."],"op",cam=True)
box(c3,r4y,bw4,r4h,["CAPOSQUADRA","formazione C.A.M."],"op",cam=True)
line([c1+bw4,c2],[r4y+r4h/2,r4y+r4h/2]); line([c2+bw4,c3],[r4y+r4h/2,r4y+r4h/2])
# Row 5 esecutori
r5y,r5h=9.4,2.15; bw=3.2; g5=(W-5*bw)/4; bus5=9.0
ex=[["IMPRESE","SPECIALIZZ.","massetti, pavim.","e finiture"],["IMPRESE","SPECIALIZZ.","copertura legno,","facciate, serram."],
    ["IMPRESA OS28","qualificata","impianti","termoidraulici"],["IMPRESA OS30","qualificata","impianti","elettrici"],
    ["SQUADRE","INTERNE","opere edili","e strutturali"]]
line([gx,gx],[r4y+r4h,bus5]); line([bw/2,3*(bw+g5)+bw/2],[bus5,bus5])
for i,l in enumerate(ex):
    x=i*(bw+g5); line([x+bw/2,x+bw/2],[bus5 if i<4 else r4y+r4h,r5y]); box(x,r5y,bw,r5h,l,"sub")
# legend
ly=12.2
ax.add_patch(FancyBboxPatch((0,ly-0.25),1.25,0.5,boxstyle="round,pad=0,rounding_size=0.1",fc="#2E8B3E",ec="white"))
ax.text(0.625,ly,"CAM",ha="center",va="center",fontsize=11,color="white",fontweight="bold")
ax.text(1.45,ly,"formazione C.A.M.",va="center",fontsize=FS)
line([5.3,6.4],[ly,ly]); ax.text(6.6,ly,"linea gerarchica",va="center",fontsize=FS)
line([10.0,11.1],[ly,ly],dash=True); ax.text(11.3,ly,"interfaccia/coordinamento",va="center",fontsize=FS)
fig.savefig("organigramma.png",dpi=300)
